using HotelMiniERP.Application.Complaints.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class UpdateComplaintCommandHandler : IRequestHandler<UpdateComplaintCommand, ComplaintDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateComplaintCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ComplaintDto> Handle(UpdateComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Type.ToLower() == "worker")
        {
            var complaint = await _context.WorkerComplaints
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
                throw new KeyNotFoundException($"Worker complaint with ID {request.Id} not found");

            // Update fields
            if (!string.IsNullOrEmpty(request.Title))
                complaint.Title = request.Title;
            
            if (!string.IsNullOrEmpty(request.Description))
                complaint.Description = request.Description;
            
            if (request.Status.HasValue)
            {
                complaint.Status = request.Status.Value;
                if (request.Status.Value == ComplaintStatus.Resolved)
                    complaint.ResolvedDate = DateTime.UtcNow;
            }
            
            if (request.Priority.HasValue)
                complaint.Priority = request.Priority.Value;
            
            if (!string.IsNullOrEmpty(request.Category))
                complaint.Category = request.Category;
            
            if (request.Location != null)
                complaint.Location = request.Location;
            
            if (request.AssignedToUserId.HasValue)
                complaint.AssignedToUserId = request.AssignedToUserId;
            
            if (!string.IsNullOrEmpty(request.Resolution))
                complaint.Resolution = request.Resolution;
            
            if (request.Notes != null)
                complaint.Notes = request.Notes;

            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ComplaintDto
            {
                Id = complaint.Id,
                Type = "worker",
                ComplaintNumber = complaint.ComplaintNumber,
                Title = complaint.Title,
                Description = complaint.Description,
                Status = complaint.Status,
                Priority = complaint.Priority,
                Category = complaint.Category,
                Location = complaint.Location,
                SubmittedByUserId = complaint.SubmittedByUserId,
                AssignedToUserId = complaint.AssignedToUserId,
                ResolvedDate = complaint.ResolvedDate,
                Resolution = complaint.Resolution,
                Notes = complaint.Notes,
                CreatedAt = complaint.CreatedAt,
                UpdatedAt = complaint.UpdatedAt
            };
        }
        else
        {
            var complaint = await _context.CustomerComplaints
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
                throw new KeyNotFoundException($"Customer complaint with ID {request.Id} not found");

            // Update fields
            if (!string.IsNullOrEmpty(request.Title))
                complaint.Title = request.Title;
            
            if (!string.IsNullOrEmpty(request.Description))
                complaint.Description = request.Description;
            
            if (request.Status.HasValue)
            {
                complaint.Status = request.Status.Value;
                if (request.Status.Value == ComplaintStatus.Resolved)
                    complaint.ResolvedDate = DateTime.UtcNow;
            }
            
            if (request.Priority.HasValue)
                complaint.Priority = request.Priority.Value;
            
            if (!string.IsNullOrEmpty(request.Category))
                complaint.Category = request.Category;
            
            if (request.Location != null)
                complaint.Location = request.Location;
            
            if (!string.IsNullOrEmpty(request.CustomerName))
                complaint.CustomerName = request.CustomerName;
            
            if (!string.IsNullOrEmpty(request.CustomerEmail))
                complaint.CustomerEmail = request.CustomerEmail;
            
            if (request.CustomerPhone != null)
                complaint.CustomerPhone = request.CustomerPhone;
            
            if (request.RoomNumber != null)
                complaint.RoomNumber = request.RoomNumber;
            
            if (request.AssignedToUserId.HasValue)
                complaint.AssignedToUserId = request.AssignedToUserId;
            
            if (!string.IsNullOrEmpty(request.Resolution))
                complaint.Resolution = request.Resolution;
            
            if (request.Notes != null)
                complaint.Notes = request.Notes;

            complaint.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ComplaintDto
            {
                Id = complaint.Id,
                Type = "customer",
                ComplaintNumber = complaint.ComplaintNumber,
                Title = complaint.Title,
                Description = complaint.Description,
                Status = complaint.Status,
                Priority = complaint.Priority,
                Category = complaint.Category,
                Location = complaint.Location,
                CustomerName = complaint.CustomerName,
                CustomerEmail = complaint.CustomerEmail,
                CustomerPhone = complaint.CustomerPhone,
                RoomNumber = complaint.RoomNumber,
                AssignedToUserId = complaint.AssignedToUserId,
                ResolvedDate = complaint.ResolvedDate,
                Resolution = complaint.Resolution,
                Notes = complaint.Notes,
                CreatedAt = complaint.CreatedAt,
                UpdatedAt = complaint.UpdatedAt
            };
        }
    }
}
