using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Inventory.Commands;

public class UpdateInventoryCommand : IRequest<InventoryDto>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int? MinimumStock { get; set; }
    public decimal? UnitCost { get; set; }
    public string? Notes { get; set; }
}
