using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Commands;

public class DeleteWorkOrderCommand : IRequest<bool>
{
    public int Id { get; set; }
}

