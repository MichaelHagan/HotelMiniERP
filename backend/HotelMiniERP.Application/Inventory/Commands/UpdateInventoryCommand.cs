using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Inventory.Commands;

public class UpdateInventoryCommand : IRequest<InventoryDto>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public string Location { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int? MinimumStock { get; set; }
    public decimal? UnitCost { get; set; }
    public string? Supplier { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyExpiry { get; set; }
    public DateTime? LastRestockedDate { get; set; }
    public string? Notes { get; set; }
}
