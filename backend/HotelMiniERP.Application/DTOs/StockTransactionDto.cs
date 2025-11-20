using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.DTOs;

public class StockTransactionDto
{
    public int Id { get; set; }
    public int InventoryId { get; set; }
    public string InventoryName { get; set; } = string.Empty;
    public StockTransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public int? VendorId { get; set; }
    public string? VendorName { get; set; }
    public DateTime TransactionDate { get; set; }
    public StockReductionReason? ReductionReason { get; set; }
    public string? Notes { get; set; }
    public decimal? UnitCost { get; set; }
    public int? CreatedByUserId { get; set; }
    public string? CreatedByUserName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateStockTransactionDto
{
    public int InventoryId { get; set; }
    public StockTransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public int? VendorId { get; set; }
    public DateTime TransactionDate { get; set; }
    public StockReductionReason? ReductionReason { get; set; }
    public string? Notes { get; set; }
    public decimal? UnitCost { get; set; }
}
