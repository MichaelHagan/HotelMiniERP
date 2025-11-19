using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.WorkOrders.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.WorkOrders.Handlers;

public class GetAllWorkOrdersQueryHandler : IRequestHandler<GetAllWorkOrdersQuery, PaginatedResponse<WorkOrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllWorkOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<WorkOrderDto>> Handle(GetAllWorkOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.WorkOrders.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<WorkOrderStatus>(request.Status, out var status))
        {
            query = query.Where(w => w.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.Priority) && Enum.TryParse<WorkOrderPriority>(request.Priority, out var priority))
        {
            query = query.Where(w => w.Priority == priority);
        }

        if (request.AssignedToUserId.HasValue)
        {
            query = query.Where(w => w.AssignedToUserId == request.AssignedToUserId.Value);
        }

        if (request.AssetId.HasValue)
        {
            query = query.Where(w => w.AssetId == request.AssetId.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        var workOrders = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<WorkOrderDto>
        {
            Data = workOrders,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
