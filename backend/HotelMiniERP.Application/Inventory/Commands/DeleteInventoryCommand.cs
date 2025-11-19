using MediatR;

namespace HotelMiniERP.Application.Inventory.Commands;

public class DeleteInventoryCommand : IRequest<bool>
{
    public int Id { get; set; }
}

