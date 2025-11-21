using HotelMiniERP.Application.Complaints.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class GetAllComplaintsQueryHandler : IRequestHandler<GetAllComplaintsQuery, PaginatedResponse<ComplaintDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllComplaintsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<ComplaintDto>> Handle(GetAllComplaintsQuery request, CancellationToken cancellationToken)
    {
        var complaints = new List<ComplaintDto>();

        // Get worker complaints if type is null or "worker"
        if (string.IsNullOrEmpty(request.Type) || request.Type.ToLower() == "worker")
        {
            var workerQuery = _context.WorkerComplaints.AsQueryable();

            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<ComplaintStatus>(request.Status, true, out var status))
                workerQuery = workerQuery.Where(c => c.Status == status);

            if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<ComplaintPriority>(request.Priority, true, out var priority))
                workerQuery = workerQuery.Where(c => c.Priority == priority);

            if (!string.IsNullOrEmpty(request.Category))
                workerQuery = workerQuery.Where(c => c.Category.ToLower().Contains(request.Category.ToLower()));

            if (request.AssignedToUserId.HasValue)
                workerQuery = workerQuery.Where(c => c.AssignedToUserId == request.AssignedToUserId.Value);

            var workerComplaints = await workerQuery
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    Type = "worker",
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    Priority = c.Priority,
                    Category = c.Category,
                    Location = c.Location,
                    SubmittedByUserId = c.SubmittedByUserId,
                    AssignedToUserId = c.AssignedToUserId,
                    AssignedToUserName = c.AssignedToUser != null 
                        ? c.AssignedToUser.FirstName + " " + c.AssignedToUser.LastName 
                        : null,
                    HasWorkOrder = c.WorkOrders.Any(),
                    ResolvedDate = c.ResolvedDate,
                    Resolution = c.Resolution,
                    Notes = c.Notes,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            complaints.AddRange(workerComplaints);
        }

        // Get customer complaints if type is null or "customer"
        if (string.IsNullOrEmpty(request.Type) || request.Type.ToLower() == "customer")
        {
            var customerQuery = _context.CustomerComplaints.AsQueryable();

            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<ComplaintStatus>(request.Status, true, out var status))
                customerQuery = customerQuery.Where(c => c.Status == status);

            if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<ComplaintPriority>(request.Priority, true, out var priority))
                customerQuery = customerQuery.Where(c => c.Priority == priority);

            if (!string.IsNullOrEmpty(request.Category))
                customerQuery = customerQuery.Where(c => c.Category.ToLower().Contains(request.Category.ToLower()));

            if (request.AssignedToUserId.HasValue)
                customerQuery = customerQuery.Where(c => c.AssignedToUserId == request.AssignedToUserId.Value);

            var customerComplaints = await customerQuery
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    Type = "customer",
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    Priority = c.Priority,
                    Category = c.Category,
                    Location = c.Location,
                    CustomerName = c.CustomerName,
                    CustomerEmail = c.CustomerEmail,
                    CustomerPhone = c.CustomerPhone,
                    RoomNumber = c.RoomNumber,
                    AssignedToUserId = c.AssignedToUserId,
                    AssignedToUserName = c.AssignedToUser != null 
                        ? c.AssignedToUser.FirstName + " " + c.AssignedToUser.LastName 
                        : null,
                    HasWorkOrder = c.WorkOrders.Any(),
                    ResolvedDate = c.ResolvedDate,
                    Resolution = c.Resolution,
                    Notes = c.Notes,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            complaints.AddRange(customerComplaints);
        }

        // Sort all complaints and apply pagination
        var sortedComplaints = complaints.OrderByDescending(c => c.CreatedAt).ToList();
        var totalCount = sortedComplaints.Count;
        var paginatedComplaints = sortedComplaints
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Load images for the paginated complaints
        var workerComplaintIds = paginatedComplaints
            .Where(c => c.Type == "worker")
            .Select(c => c.Id)
            .ToList();
        
        var customerComplaintIds = paginatedComplaints
            .Where(c => c.Type == "customer")
            .Select(c => c.Id)
            .ToList();

        var allImages = await _context.ComplaintImages
            .Where(ci => 
                (ci.WorkerComplaintId.HasValue && workerComplaintIds.Contains(ci.WorkerComplaintId.Value)) ||
                (ci.CustomerComplaintId.HasValue && customerComplaintIds.Contains(ci.CustomerComplaintId.Value)))
            .ToListAsync(cancellationToken);

        // Group images by complaint using foreign keys
        var workerImages = allImages
            .Where(ci => ci.WorkerComplaintId.HasValue)
            .GroupBy(ci => ci.WorkerComplaintId!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.Select(ci => new ComplaintImageDto
                {
                    Id = ci.Id,
                    ImageUrl = ci.ImageUrl,
                    PublicId = ci.PublicId,
                    FileName = ci.FileName,
                    FileSize = ci.FileSize,
                    CreatedAt = ci.CreatedAt
                }).ToList()
            );

        var customerImages = allImages
            .Where(ci => ci.CustomerComplaintId.HasValue)
            .GroupBy(ci => ci.CustomerComplaintId!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.Select(ci => new ComplaintImageDto
                {
                    Id = ci.Id,
                    ImageUrl = ci.ImageUrl,
                    PublicId = ci.PublicId,
                    FileName = ci.FileName,
                    FileSize = ci.FileSize,
                    CreatedAt = ci.CreatedAt
                }).ToList()
            );

        // Attach images to complaints
        foreach (var complaint in paginatedComplaints)
        {
            if (complaint.Type == "worker" && workerImages.ContainsKey(complaint.Id))
            {
                complaint.ImageUrls = workerImages[complaint.Id];
            }
            else if (complaint.Type == "customer" && customerImages.ContainsKey(complaint.Id))
            {
                complaint.ImageUrls = customerImages[complaint.Id];
            }
        }

        return new PaginatedResponse<ComplaintDto>
        {
            Data = paginatedComplaints,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
