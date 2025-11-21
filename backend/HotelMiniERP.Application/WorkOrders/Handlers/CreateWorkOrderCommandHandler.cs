using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.WorkOrders.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.WorkOrders.Handlers;

public class CreateWorkOrderCommandHandler : IRequestHandler<CreateWorkOrderCommand, WorkOrderDto>
{
    private readonly IApplicationDbContext _context;

    public CreateWorkOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkOrderDto> Handle(CreateWorkOrderCommand request, CancellationToken cancellationToken)
    {
        // Generate work order number
        var count = await _context.WorkOrders.CountAsync(cancellationToken);
        var workOrderNumber = $"WO-{DateTime.UtcNow:yyyyMMdd}-{count + 1:D4}";

        var workOrder = new WorkOrder
        {
            WorkOrderNumber = workOrderNumber,
            Title = request.Title,
            Description = request.Description,
            Status = WorkOrderStatus.Created,
            Priority = request.Priority,
            RequestedDate = DateTime.UtcNow,
            ScheduledDate = request.ScheduledDate,
            EstimatedCost = request.EstimatedCost,
            VendorCost = request.VendorCost,
            WorkType = request.WorkType,
            Location = request.Location,
            Notes = request.Notes,
            AssetId = request.AssetId,
            AssignedToUserId = request.AssignedToUserId,
            RequestedByUserId = request.RequestedByUserId,
            WorkerComplaintId = request.WorkerComplaintId,
            CustomerComplaintId = request.CustomerComplaintId,
            VendorId = request.VendorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.WorkOrders.Add(workOrder);
        await _context.SaveChangesAsync(cancellationToken);

        // Auto-assign complaint to the same user if work order has an assigned user
        if (request.AssignedToUserId.HasValue)
        {
            if (request.WorkerComplaintId.HasValue)
            {
                var complaint = await _context.WorkerComplaints
                    .FirstOrDefaultAsync(c => c.Id == request.WorkerComplaintId.Value, cancellationToken);
                
                if (complaint != null && complaint.AssignedToUserId != request.AssignedToUserId)
                {
                    complaint.AssignedToUserId = request.AssignedToUserId;
                    complaint.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
            else if (request.CustomerComplaintId.HasValue)
            {
                var complaint = await _context.CustomerComplaints
                    .FirstOrDefaultAsync(c => c.Id == request.CustomerComplaintId.Value, cancellationToken);
                
                if (complaint != null && complaint.AssignedToUserId != request.AssignedToUserId)
                {
                    complaint.AssignedToUserId = request.AssignedToUserId;
                    complaint.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
        }

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
                VendorCost = w.VendorCost,
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
                VendorId = w.VendorId,
                VendorName = w.Vendor != null ? w.Vendor.Name : null,
                CreatedAt = w.CreatedAt,
                UpdatedAt = w.UpdatedAt
            })
            .FirstAsync(cancellationToken);
    }
}
