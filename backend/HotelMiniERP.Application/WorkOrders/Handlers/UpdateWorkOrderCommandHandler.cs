using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.WorkOrders.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.WorkOrders.Handlers;

public class UpdateWorkOrderCommandHandler : IRequestHandler<UpdateWorkOrderCommand, WorkOrderDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateWorkOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkOrderDto> Handle(UpdateWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var workOrder = await _context.WorkOrders
            .Include(w => w.WorkerComplaint)
            .Include(w => w.CustomerComplaint)
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (workOrder == null)
        {
            throw new InvalidOperationException($"Work order with ID {request.Id} not found.");
        }

        // Business Rule: Only managers and admins can assign work orders
        if (request.AssignedToUserId.HasValue && request.AssignedToUserId != workOrder.AssignedToUserId)
        {
            if (request.CurrentUserRole != UserRole.Manager && request.CurrentUserRole != UserRole.Admin)
            {
                throw new UnauthorizedAccessException("Only managers and administrators can assign work orders.");
            }
        }

        var previousStatus = workOrder.Status;

        workOrder.Title = request.Title;
        workOrder.Description = request.Description;
        workOrder.Status = request.Status;
        workOrder.Priority = request.Priority;
        workOrder.ScheduledDate = request.ScheduledDate;
        workOrder.CompletedDate = request.CompletedDate;
        workOrder.EstimatedCost = request.EstimatedCost;
        workOrder.ActualCost = request.ActualCost;
        workOrder.WorkType = request.WorkType;
        workOrder.Location = request.Location;
        workOrder.Notes = request.Notes;
        workOrder.AssetId = request.AssetId;
        workOrder.AssignedToUserId = request.AssignedToUserId;
        workOrder.UpdatedAt = DateTime.UtcNow;

        if (request.Status == WorkOrderStatus.Completed && request.CompletedDate == null)
        {
            workOrder.CompletedDate = DateTime.UtcNow;
        }

        // Business Rule: Auto-close linked complaints when work order is completed
        if (request.Status == WorkOrderStatus.Completed && previousStatus != WorkOrderStatus.Completed)
        {
            if (workOrder.WorkerComplaintId.HasValue && workOrder.WorkerComplaint != null)
            {
                workOrder.WorkerComplaint.Status = ComplaintStatus.Resolved;
                workOrder.WorkerComplaint.ResolvedDate = DateTime.UtcNow;
                workOrder.WorkerComplaint.UpdatedAt = DateTime.UtcNow;
            }

            if (workOrder.CustomerComplaintId.HasValue && workOrder.CustomerComplaint != null)
            {
                workOrder.CustomerComplaint.Status = ComplaintStatus.Resolved;
                workOrder.CustomerComplaint.ResolvedDate = DateTime.UtcNow;
                workOrder.CustomerComplaint.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return await GetWorkOrderDto(workOrder.Id, cancellationToken);
    }

    private async Task<WorkOrderDto> GetWorkOrderDto(int id, CancellationToken cancellationToken)
    {
        return await _context.WorkOrders
            .Where(w => w.Id == id)
            .Select(w => new WorkOrderDto
            {
                Id = w.Id,
                WorkOrderNumber = w.WorkOrderNumber,
                Title = w.Title,
                Description = w.Description,
                Status = w.Status,
                Priority = w.Priority,
                RequestedDate = w.RequestedDate,
                ScheduledDate = w.ScheduledDate,
                CompletedDate = w.CompletedDate,
                EstimatedCost = w.EstimatedCost,
                ActualCost = w.ActualCost,
                WorkType = w.WorkType,
                Location = w.Location,
                Notes = w.Notes,
                AssetId = w.AssetId,
                AssetName = w.Asset != null ? w.Asset.AssetName : null,
                AssignedToUserId = w.AssignedToUserId,
                AssignedToUserName = w.AssignedToUser != null ? w.AssignedToUser.FirstName + " " + w.AssignedToUser.LastName : null,
                RequestedByUserId = w.RequestedByUserId,
                RequestedByUserName = w.RequestedByUser != null ? w.RequestedByUser.FirstName + " " + w.RequestedByUser.LastName : null,
                WorkerComplaintId = w.WorkerComplaintId,
                CustomerComplaintId = w.CustomerComplaintId,
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt
            })
            .FirstAsync(cancellationToken);
    }
}
