using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Queries;

public class GetWorkOrderByIdQuery : IRequest<WorkOrderDto?>
{
    public int Id { get; set; }
}
