using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetAllWorkOrdersQuery : IRequest<PaginatedResponse<WorkOrderDto>>
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? AssetId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
