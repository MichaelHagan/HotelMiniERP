using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetWorkOrdersByPriorityQuery : IRequest<List<WorkOrderDto>>
{
    public string Priority { get; set; } = string.Empty;
}

