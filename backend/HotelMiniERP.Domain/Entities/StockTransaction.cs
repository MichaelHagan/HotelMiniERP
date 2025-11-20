using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Domain.Entities;

public class StockTransaction : BaseEntity
{
    public int InventoryId { get; set; }
    public StockTransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public int? VendorId { get; set; }
    public DateTime TransactionDate { get; set; }
    public StockReductionReason? ReductionReason { get; set; }
    public string? Notes { get; set; }
    public decimal? UnitCost { get; set; }
    public int? CreatedByUserId { get; set; }

    // Navigation properties
    public virtual Inventory Inventory { get; set; } = null!;
    public virtual Vendor? Vendor { get; set; }
    public virtual User? CreatedByUser { get; set; }
}
