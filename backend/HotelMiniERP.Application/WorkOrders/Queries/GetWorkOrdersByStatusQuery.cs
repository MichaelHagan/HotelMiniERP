using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetWorkOrdersByStatusQuery : IRequest<List<WorkOrderDto>>
{
    public string Status { get; set; } = string.Empty;
}

