using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetAllWorkOrdersQuery : IRequest<List<WorkOrderDto>>
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? AssetId { get; set; }
}
