using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Complaints.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class DeleteComplaintCommandHandler : IRequestHandler<DeleteComplaintCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ILogger<DeleteComplaintCommandHandler> _logger;

    public DeleteComplaintCommandHandler(
        IApplicationDbContext context, 
        ICloudinaryService cloudinaryService,
        ILogger<DeleteComplaintCommandHandler> logger)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Type.ToLower() == "worker")
        {
            var complaint = await _context.WorkerComplaints
                .Include(c => c.ComplaintImages)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
            {
                return false;
            }

            // Check if complaint has associated work orders
            var hasWorkOrders = await _context.WorkOrders
                .AnyAsync(w => w.WorkerComplaintId == request.Id, cancellationToken);

            if (hasWorkOrders)
            {
                throw new InvalidOperationException("Cannot delete complaint that has associated work orders.");
            }

            // Delete images from Cloudinary
            await DeleteImagesFromCloudinaryAsync(complaint.ComplaintImages);

            _context.WorkerComplaints.Remove(complaint);
        }
        else if (request.Type.ToLower() == "customer")
        {
            var complaint = await _context.CustomerComplaints
                .Include(c => c.ComplaintImages)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
            {
                return false;
            }

            // Check if complaint has associated work orders
            var hasWorkOrders = await _context.WorkOrders
                .AnyAsync(w => w.CustomerComplaintId == request.Id, cancellationToken);

            if (hasWorkOrders)
            {
                throw new InvalidOperationException("Cannot delete complaint that has associated work orders.");
            }

            // Delete images from Cloudinary
            await DeleteImagesFromCloudinaryAsync(complaint.ComplaintImages);

            _context.CustomerComplaints.Remove(complaint);
        }
        else
        {
            throw new InvalidOperationException($"Invalid complaint type: {request.Type}. Must be 'worker' or 'customer'.");
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task DeleteImagesFromCloudinaryAsync(ICollection<Domain.Entities.ComplaintImage> images)
    {
        if (images == null || !images.Any())
        {
            return;
        }

        foreach (var image in images)
        {
            try
            {
                var deleted = await _cloudinaryService.DeleteImageAsync(image.PublicId);
                if (!deleted)
                {
                    _logger.LogWarning(
                        "Failed to delete image {PublicId} from Cloudinary for complaint image {ImageId}", 
                        image.PublicId, 
                        image.Id);
                }
            }
            catch (Exception ex)
            {
                // Log error but continue - don't block deletion if Cloudinary fails
                _logger.LogError(ex, 
                    "Error deleting image {PublicId} from Cloudinary for complaint image {ImageId}", 
                    image.PublicId, 
                    image.Id);
            }
        }
    }
}

