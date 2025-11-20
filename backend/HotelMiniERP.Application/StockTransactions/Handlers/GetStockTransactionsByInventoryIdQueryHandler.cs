using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.StockTransactions.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.StockTransactions.Handlers;

public class GetStockTransactionsByInventoryIdQueryHandler : IRequestHandler<GetStockTransactionsByInventoryIdQuery, List<StockTransactionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStockTransactionsByInventoryIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StockTransactionDto>> Handle(GetStockTransactionsByInventoryIdQuery request, CancellationToken cancellationToken)
    {
        var transactions = await _context.StockTransactions
            .Include(st => st.Inventory)
            .Include(st => st.Vendor)
            .Include(st => st.CreatedByUser)
            .Where(st => st.InventoryId == request.InventoryId)
            .OrderByDescending(st => st.TransactionDate)
            .ThenByDescending(st => st.CreatedAt)
            .Select(st => new StockTransactionDto
            {
                Id = st.Id,
                InventoryId = st.InventoryId,
                InventoryName = st.Inventory.Name,
                TransactionType = st.TransactionType,
                Quantity = st.Quantity,
                VendorId = st.VendorId,
                VendorName = st.Vendor != null ? st.Vendor.Name : null,
                TransactionDate = st.TransactionDate,
                ReductionReason = st.ReductionReason,
                Notes = st.Notes,
                UnitCost = st.UnitCost,
                CreatedByUserId = st.CreatedByUserId,
                CreatedByUserName = st.CreatedByUser != null 
                    ? $"{st.CreatedByUser.FirstName} {st.CreatedByUser.LastName}"
                    : null,
                CreatedAt = st.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return transactions;
    }
}
