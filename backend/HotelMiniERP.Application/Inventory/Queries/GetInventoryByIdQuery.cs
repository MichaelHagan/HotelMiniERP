using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Inventory.Queries;

public class GetInventoryByIdQuery : IRequest<InventoryDto?>
{
    public int Id { get; set; }
}
