namespace HotelMiniERP.Application.DTOs;

public class InventoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int? MinimumStock { get; set; }
    public decimal? UnitCost { get; set; }
    public DateTime? LastRestockedDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
