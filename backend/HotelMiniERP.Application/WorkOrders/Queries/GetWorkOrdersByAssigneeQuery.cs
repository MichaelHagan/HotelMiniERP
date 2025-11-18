using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetWorkOrdersByAssigneeQuery : IRequest<List<WorkOrderDto>>
{
    public int AssignedToUserId { get; set; }
    public string? Status { get; set; }
}

