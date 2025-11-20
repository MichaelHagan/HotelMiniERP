using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.StockTransactions.Commands;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.StockTransactions.Handlers;

public class CreateStockTransactionCommandHandler : IRequestHandler<CreateStockTransactionCommand, StockTransactionDto>
{
    private readonly IApplicationDbContext _context;

    public CreateStockTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StockTransactionDto> Handle(CreateStockTransactionCommand request, CancellationToken cancellationToken)
    {
        // Fetch the inventory item
        var inventory = await _context.Inventory
            .FirstOrDefaultAsync(i => i.Id == request.InventoryId, cancellationToken);

        if (inventory == null)
        {
            throw new KeyNotFoundException($"Inventory item with ID {request.InventoryId} not found");
        }

        // Validate vendor exists if provided
        if (request.VendorId.HasValue)
        {
            var vendorExists = await _context.Vendors
                .AnyAsync(v => v.Id == request.VendorId.Value, cancellationToken);
            
            if (!vendorExists)
            {
                throw new KeyNotFoundException($"Vendor with ID {request.VendorId} not found");
            }
        }

        // Validate user exists if provided
        if (request.CreatedByUserId.HasValue)
        {
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == request.CreatedByUserId.Value, cancellationToken);
            
            if (!userExists)
            {
                throw new KeyNotFoundException($"User with ID {request.CreatedByUserId} not found");
            }
        }

        // Create the stock transaction
        var stockTransaction = new StockTransaction
        {
            InventoryId = request.InventoryId,
            TransactionType = request.TransactionType,
            Quantity = request.Quantity,
            VendorId = request.VendorId,
            TransactionDate = request.TransactionDate,
            ReductionReason = request.ReductionReason,
            Notes = request.Notes,
            UnitCost = request.UnitCost,
            CreatedByUserId = request.CreatedByUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Update inventory quantity based on transaction type
        if (request.TransactionType == StockTransactionType.Restock)
        {
            inventory.Quantity += request.Quantity;
            inventory.LastRestockedDate = request.TransactionDate;
        }
        else if (request.TransactionType == StockTransactionType.Reduction)
        {
            inventory.Quantity -= request.Quantity;
            
            // Validate that quantity doesn't go negative
            if (inventory.Quantity < 0)
            {
                throw new InvalidOperationException(
                    $"Insufficient stock. Current quantity: {inventory.Quantity + request.Quantity}, " +
                    $"Requested reduction: {request.Quantity}");
            }
        }

        inventory.UpdatedAt = DateTime.UtcNow;

        // Save both the transaction and updated inventory
        _context.StockTransactions.Add(stockTransaction);
        await _context.SaveChangesAsync(cancellationToken);

        // Fetch the created transaction with related data for the response
        var createdTransaction = await _context.StockTransactions
            .Include(st => st.Inventory)
            .Include(st => st.Vendor)
            .Include(st => st.CreatedByUser)
            .FirstOrDefaultAsync(st => st.Id == stockTransaction.Id, cancellationToken);

        return new StockTransactionDto
        {
            Id = createdTransaction!.Id,
            InventoryId = createdTransaction.InventoryId,
            InventoryName = createdTransaction.Inventory.Name,
            TransactionType = createdTransaction.TransactionType,
            Quantity = createdTransaction.Quantity,
            VendorId = createdTransaction.VendorId,
            VendorName = createdTransaction.Vendor?.Name,
            TransactionDate = createdTransaction.TransactionDate,
            ReductionReason = createdTransaction.ReductionReason,
            Notes = createdTransaction.Notes,
            UnitCost = createdTransaction.UnitCost,
            CreatedByUserId = createdTransaction.CreatedByUserId,
            CreatedByUserName = createdTransaction.CreatedByUser != null 
                ? $"{createdTransaction.CreatedByUser.FirstName} {createdTransaction.CreatedByUser.LastName}"
                : null,
            CreatedAt = createdTransaction.CreatedAt
        };
    }
}
