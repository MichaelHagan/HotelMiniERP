using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.WorkOrders.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.WorkOrders.Handlers;

public class GetWorkOrdersByAssigneeQueryHandler : IRequestHandler<GetWorkOrdersByAssigneeQuery, List<WorkOrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetWorkOrdersByAssigneeQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkOrderDto>> Handle(GetWorkOrdersByAssigneeQuery request, CancellationToken cancellationToken)
    {
        var query = _context.WorkOrders
            .Where(w => w.AssignedToUserId == request.AssignedToUserId);

        if (!string.IsNullOrEmpty(request.Status) && 
            Enum.TryParse<WorkOrderStatus>(request.Status, true, out var status))
        {
            query = query.Where(w => w.Status == status);
        }

        return await query
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
            .OrderByDescending(w => w.RequestedDate)
            .ToListAsync(cancellationToken);
    }
}

