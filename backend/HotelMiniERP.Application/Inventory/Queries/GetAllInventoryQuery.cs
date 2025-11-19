using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Inventory.Queries;

public class GetAllInventoryQuery : IRequest<List<InventoryDto>>
{
    public string? Category { get; set; }
    public string? Location { get; set; }
}
