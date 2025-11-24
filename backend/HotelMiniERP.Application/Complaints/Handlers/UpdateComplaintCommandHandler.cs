using HotelMiniERP.Application.Complaints.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Services;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class UpdateComplaintCommandHandler : IRequestHandler<UpdateComplaintCommand, ComplaintDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ISystemNotificationService _notificationService;

    public UpdateComplaintCommandHandler(IApplicationDbContext context, ISystemNotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<ComplaintDto> Handle(UpdateComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Type.ToLower() == "worker")
        {
            var complaint = await _context.WorkerComplaints
                .Include(c => c.WorkOrders)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
                throw new KeyNotFoundException($"Worker complaint with ID {request.Id} not found");

            var previousStatus = complaint.Status;

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
            
            var previousAssignedTo = complaint.AssignedToUserId;
            if (request.AssignedToUserId.HasValue)
            {
                complaint.AssignedToUserId = request.AssignedToUserId;
                
                // Send notification when complaint is assigned to a new user
                if (previousAssignedTo != request.AssignedToUserId && request.AssignedToUserId.Value > 0)
                {
                    await _notificationService.NotifyComplaintAssigned(
                        complaint.Id,
                        request.AssignedToUserId.Value,
                        complaint.Title
                    );
                }
            }
            
            if (!string.IsNullOrEmpty(request.Resolution))
                complaint.Resolution = request.Resolution;
            
            if (request.Notes != null)
                complaint.Notes = request.Notes;

            complaint.UpdatedAt = DateTime.UtcNow;

            // Auto-complete related work orders when complaint is resolved
            if (request.Status.HasValue && request.Status.Value == ComplaintStatus.Resolved && previousStatus != ComplaintStatus.Resolved)
            {
                var relatedWorkOrders = complaint.WorkOrders?
                    .Where(wo => wo.Status != WorkOrderStatus.Completed && wo.Status != WorkOrderStatus.Cancelled)
                    .ToList();

                if (relatedWorkOrders?.Any() == true)
                {
                    foreach (var workOrder in relatedWorkOrders)
                    {
                        workOrder.Status = WorkOrderStatus.Completed;
                        workOrder.CompletedDate = DateTime.UtcNow;
                        workOrder.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

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
                .Include(c => c.WorkOrders)
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
                throw new KeyNotFoundException($"Customer complaint with ID {request.Id} not found");

            var previousStatus = complaint.Status;

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
            
            var previousAssignedTo = complaint.AssignedToUserId;
            if (request.AssignedToUserId.HasValue)
            {
                complaint.AssignedToUserId = request.AssignedToUserId;
                
                // Send notification when complaint is assigned to a new user
                if (previousAssignedTo != request.AssignedToUserId && request.AssignedToUserId.Value > 0)
                {
                    await _notificationService.NotifyComplaintAssigned(
                        complaint.Id,
                        request.AssignedToUserId.Value,
                        complaint.Title
                    );
                }
            }
            
            if (!string.IsNullOrEmpty(request.Resolution))
                complaint.Resolution = request.Resolution;
            
            if (request.Notes != null)
                complaint.Notes = request.Notes;

            complaint.UpdatedAt = DateTime.UtcNow;

            // Auto-complete related work orders when complaint is resolved
            if (request.Status.HasValue && request.Status.Value == ComplaintStatus.Resolved && previousStatus != ComplaintStatus.Resolved)
            {
                var relatedWorkOrders = complaint.WorkOrders?
                    .Where(wo => wo.Status != WorkOrderStatus.Completed && wo.Status != WorkOrderStatus.Cancelled)
                    .ToList();

                if (relatedWorkOrders?.Any() == true)
                {
                    foreach (var workOrder in relatedWorkOrders)
                    {
                        workOrder.Status = WorkOrderStatus.Completed;
                        workOrder.CompletedDate = DateTime.UtcNow;
                        workOrder.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

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
