using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.StockTransactions.Commands;

public class CreateStockTransactionCommand : IRequest<StockTransactionDto>
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
}
