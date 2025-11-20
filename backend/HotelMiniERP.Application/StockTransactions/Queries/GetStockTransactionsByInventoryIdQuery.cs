using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.StockTransactions.Queries;

public class GetStockTransactionsByInventoryIdQuery : IRequest<List<StockTransactionDto>>
{
    public int InventoryId { get; set; }
}
