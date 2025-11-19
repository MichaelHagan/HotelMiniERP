using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Commands;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class UpdateInventoryCommandHandler : IRequestHandler<UpdateInventoryCommand, InventoryDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateInventoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryDto> Handle(UpdateInventoryCommand request, CancellationToken cancellationToken)
    {
        var inventory = await _context.Inventory.FindAsync(new object[] { request.Id }, cancellationToken);

        if (inventory == null)
        {
            throw new InvalidOperationException($"Inventory with ID {request.Id} not found.");
        }

        // Check for duplicate code (excluding current inventory item)
        var existingCode = await _context.Inventory
            .AnyAsync(e => e.Id != request.Id && e.Code.ToLower() == request.Code.ToLower(), cancellationToken);

        if (existingCode)
        {
            throw new InvalidOperationException($"Inventory code '{request.Code}' already exists.");
        }

        inventory.Name = request.Name;
        inventory.Code = request.Code;
        inventory.Description = request.Description;
        inventory.Category = request.Category;
        inventory.Brand = request.Brand;
        inventory.Model = request.Model;
        inventory.SerialNumber = request.SerialNumber;
        inventory.Location = request.Location ?? string.Empty;
        inventory.Quantity = request.Quantity;
        inventory.MinimumStock = request.MinimumStock;
        inventory.UnitCost = request.UnitCost;
        inventory.Supplier = request.Supplier;
        inventory.LastRestockedDate = request.LastRestockedDate;
        inventory.Notes = request.Notes;
        inventory.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new InventoryDto
        {
            Id = inventory.Id,
            Name = inventory.Name,
            Code = inventory.Code,
            Description = inventory.Description,
            Category = inventory.Category,
            Brand = inventory.Brand,
            Model = inventory.Model,
            SerialNumber = inventory.SerialNumber,
            Location = inventory.Location,
            Quantity = inventory.Quantity,
            MinimumStock = inventory.MinimumStock,
            UnitCost = inventory.UnitCost,
            Supplier = inventory.Supplier,
            PurchaseDate = inventory.PurchaseDate,
            WarrantyExpiry = inventory.WarrantyExpiry,
            LastRestockedDate = inventory.LastRestockedDate,
            Notes = inventory.Notes,
            CreatedAt = inventory.CreatedAt,
            UpdatedAt = inventory.UpdatedAt
        };
    }
}
