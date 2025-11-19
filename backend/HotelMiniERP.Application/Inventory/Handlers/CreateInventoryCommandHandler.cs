using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class CreateEquipmentCommandHandler : IRequestHandler<CreateInventoryCommand, InventoryDto>
{
    private readonly IApplicationDbContext _context;

    public CreateEquipmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryDto> Handle(CreateInventoryCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate code
        var existingCode = await _context.Inventory
            .AnyAsync(e => e.Code.ToLower() == request.Code.ToLower(), cancellationToken);

        if (existingCode)
        {
            throw new InvalidOperationException($"Inventory code '{request.Code}' already exists.");
        }

        var inventory = new HotelMiniERP.Domain.Entities.Inventory
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            Category = request.Category,
            Brand = request.Brand,
            Model = request.Model,
            SerialNumber = request.SerialNumber,
            Location = request.Location ?? string.Empty,
            Quantity = request.Quantity,
            MinimumStock = request.MinimumStock,
            UnitCost = request.UnitCost,
            Supplier = request.Supplier,
            PurchaseDate = request.PurchaseDate,
            WarrantyExpiry = request.WarrantyExpiry,
            LastRestockedDate = request.LastRestockedDate,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Inventory.Add(inventory);
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
