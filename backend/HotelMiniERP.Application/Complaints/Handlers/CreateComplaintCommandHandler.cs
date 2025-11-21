using HotelMiniERP.Application.Complaints.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class CreateComplaintCommandHandler : IRequestHandler<CreateComplaintCommand, ComplaintDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ILogger<CreateComplaintCommandHandler> _logger;

    public CreateComplaintCommandHandler(
        IApplicationDbContext context,
        ICloudinaryService cloudinaryService,
        ILogger<CreateComplaintCommandHandler> logger)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    public async Task<ComplaintDto> Handle(CreateComplaintCommand request, CancellationToken cancellationToken)
    {
        var uploadedImages = new List<(string SecureUrl, string PublicId, string FileName, long FileSize)>();

        try
        {
            // Upload images to Cloudinary first
            if (request.Images != null && request.Images.Any())
            {
                _logger.LogInformation("Uploading {Count} images to Cloudinary", request.Images.Count);

                foreach (var file in request.Images)
                {
                    var (secureUrl, publicId) = await _cloudinaryService.UploadImageAsync(file);
                    uploadedImages.Add((secureUrl, publicId, file.FileName, file.Length));
                }

                _logger.LogInformation("Successfully uploaded {Count} images", uploadedImages.Count);
            }

            // Generate complaint number
            var prefix = request.Type.ToLower() == "worker" ? "WC" : "CC";
            var date = DateTime.UtcNow;
            var count = request.Type.ToLower() == "worker"
                ? await _context.WorkerComplaints.CountAsync(cancellationToken)
                : await _context.CustomerComplaints.CountAsync(cancellationToken);
            var complaintNumber = $"{prefix}-{date:yyyyMMdd}-{(count + 1):D4}";

            if (request.Type.ToLower() == "worker")
            {
                return await CreateWorkerComplaintAsync(request, complaintNumber, uploadedImages, cancellationToken);
            }
            else
            {
                return await CreateCustomerComplaintAsync(request, complaintNumber, uploadedImages, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            // Rollback: Delete uploaded images from Cloudinary
            if (uploadedImages.Any())
            {
                _logger.LogWarning("Rolling back: Deleting {Count} uploaded images from Cloudinary", uploadedImages.Count);
                
                foreach (var (_, publicId, _, _) in uploadedImages)
                {
                    try
                    {
                        await _cloudinaryService.DeleteImageAsync(publicId);
                    }
                    catch (Exception deleteEx)
                    {
                        _logger.LogError(deleteEx, "Failed to delete image {PublicId} during rollback", publicId);
                    }
                }
            }

            _logger.LogError(ex, "Failed to create complaint");
            throw;
        }
    }

    private async Task<ComplaintDto> CreateWorkerComplaintAsync(
        CreateComplaintCommand request,
        string complaintNumber,
        List<(string SecureUrl, string PublicId, string FileName, long FileSize)> uploadedImages,
        CancellationToken cancellationToken)
    {
        if (!request.SubmittedByUserId.HasValue)
            throw new InvalidOperationException("SubmittedByUserId is required for worker complaints");

        var workerComplaint = new WorkerComplaint
        {
            ComplaintNumber = complaintNumber,
            Title = request.Title,
            Description = request.Description,
            Status = ComplaintStatus.Open,
            Priority = request.Priority,
            Category = request.Category,
            Location = request.Location,
            SubmittedByUserId = request.SubmittedByUserId.Value,
            AssignedToUserId = request.AssignedToUserId,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.WorkerComplaints.Add(workerComplaint);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created worker complaint with ID: {ComplaintId}, Number: {ComplaintNumber}", 
            workerComplaint.Id, workerComplaint.ComplaintNumber);

        // Add complaint images
        var images = new List<ComplaintImageDto>();
        if (uploadedImages.Any())
        {
            _logger.LogInformation("Adding {Count} images to complaint ID: {ComplaintId}", 
                uploadedImages.Count, workerComplaint.Id);
                
            foreach (var (secureUrl, publicId, fileName, fileSize) in uploadedImages)
            {
                var complaintImage = new ComplaintImage
                {
                    ImageUrl = secureUrl,
                    PublicId = publicId,
                    FileName = fileName,
                    FileSize = fileSize,
                    WorkerComplaintId = workerComplaint.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.ComplaintImages.Add(complaintImage);
                
                _logger.LogInformation("Added image {FileName} to complaint {ComplaintId}", 
                    fileName, workerComplaint.Id);
            }
            await _context.SaveChangesAsync(cancellationToken);

            // Load images for response
            images = await _context.ComplaintImages
                .Where(ci => ci.WorkerComplaintId == workerComplaint.Id)
                .Select(ci => new ComplaintImageDto
                {
                    Id = ci.Id,
                    ImageUrl = ci.ImageUrl,
                    PublicId = ci.PublicId,
                    FileName = ci.FileName,
                    FileSize = ci.FileSize,
                    CreatedAt = ci.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }

        return new ComplaintDto
        {
            Id = workerComplaint.Id,
            Type = "worker",
            ComplaintNumber = workerComplaint.ComplaintNumber,
            Title = workerComplaint.Title,
            Description = workerComplaint.Description,
            Status = workerComplaint.Status,
            Priority = workerComplaint.Priority,
            Category = workerComplaint.Category,
            Location = workerComplaint.Location,
            SubmittedByUserId = workerComplaint.SubmittedByUserId,
            AssignedToUserId = workerComplaint.AssignedToUserId,
            ResolvedDate = workerComplaint.ResolvedDate,
            Resolution = workerComplaint.Resolution,
            Notes = workerComplaint.Notes,
            ImageUrls = images,
            CreatedAt = workerComplaint.CreatedAt,
            UpdatedAt = workerComplaint.UpdatedAt
        };
    }

    private async Task<ComplaintDto> CreateCustomerComplaintAsync(
        CreateComplaintCommand request,
        string complaintNumber,
        List<(string SecureUrl, string PublicId, string FileName, long FileSize)> uploadedImages,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.CustomerName) || string.IsNullOrEmpty(request.CustomerEmail))
            throw new InvalidOperationException("CustomerName and CustomerEmail are required for customer complaints");

        var customerComplaint = new CustomerComplaint
        {
            ComplaintNumber = complaintNumber,
            Title = request.Title,
            Description = request.Description,
            Status = ComplaintStatus.Open,
            Priority = request.Priority,
            Category = request.Category,
            Location = request.Location,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            RoomNumber = request.RoomNumber,
            AssignedToUserId = request.AssignedToUserId,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.CustomerComplaints.Add(customerComplaint);
        await _context.SaveChangesAsync(cancellationToken);

        // Add complaint images
        var images = new List<ComplaintImageDto>();
        if (uploadedImages.Any())
        {
            foreach (var (secureUrl, publicId, fileName, fileSize) in uploadedImages)
            {
                var complaintImage = new ComplaintImage
                {
                    ImageUrl = secureUrl,
                    PublicId = publicId,
                    FileName = fileName,
                    FileSize = fileSize,
                    CustomerComplaintId = customerComplaint.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.ComplaintImages.Add(complaintImage);
            }
            await _context.SaveChangesAsync(cancellationToken);

            // Load images for response
            images = await _context.ComplaintImages
                .Where(ci => ci.CustomerComplaintId == customerComplaint.Id)
                .Select(ci => new ComplaintImageDto
                {
                    Id = ci.Id,
                    ImageUrl = ci.ImageUrl,
                    PublicId = ci.PublicId,
                    FileName = ci.FileName,
                    FileSize = ci.FileSize,
                    CreatedAt = ci.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }

        return new ComplaintDto
        {
            Id = customerComplaint.Id,
            Type = "customer",
            ComplaintNumber = customerComplaint.ComplaintNumber,
            Title = customerComplaint.Title,
            Description = customerComplaint.Description,
            Status = customerComplaint.Status,
            Priority = customerComplaint.Priority,
            Category = customerComplaint.Category,
            Location = customerComplaint.Location,
            CustomerName = customerComplaint.CustomerName,
            CustomerEmail = customerComplaint.CustomerEmail,
            CustomerPhone = customerComplaint.CustomerPhone,
            RoomNumber = customerComplaint.RoomNumber,
            AssignedToUserId = customerComplaint.AssignedToUserId,
            ResolvedDate = customerComplaint.ResolvedDate,
            Resolution = customerComplaint.Resolution,
            Notes = customerComplaint.Notes,
            ImageUrls = images,
            CreatedAt = customerComplaint.CreatedAt,
            UpdatedAt = customerComplaint.UpdatedAt
        };
    }
}
