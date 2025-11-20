using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class CreateInventoryCommandHandler : IRequestHandler<CreateInventoryCommand, InventoryDto>
{
    private readonly IApplicationDbContext _context;

    public CreateInventoryCommandHandler(IApplicationDbContext context)
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
            Location = request.Location ?? string.Empty,
            Quantity = request.Quantity,
            MinimumStock = request.MinimumStock,
            UnitCost = request.UnitCost,
            VendorId = request.VendorId,
            LastRestockedDate = request.LastRestockedDate,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Inventory.Add(inventory);
        await _context.SaveChangesAsync(cancellationToken);

        // Load vendor name if VendorId is set
        string? vendorName = null;
        if (inventory.VendorId.HasValue)
        {
            var vendor = await _context.Vendors.FindAsync(new object[] { inventory.VendorId.Value }, cancellationToken);
            vendorName = vendor?.Name;
        }

        return new InventoryDto
        {
            Id = inventory.Id,
            Name = inventory.Name,
            Code = inventory.Code,
            Description = inventory.Description,
            Category = inventory.Category,
            Brand = inventory.Brand,
            Model = inventory.Model,
            Location = inventory.Location,
            Quantity = inventory.Quantity,
            MinimumStock = inventory.MinimumStock,
            UnitCost = inventory.UnitCost,
            VendorId = inventory.VendorId,
            VendorName = vendorName,
            LastRestockedDate = inventory.LastRestockedDate,
            Notes = inventory.Notes,
            CreatedAt = inventory.CreatedAt,
            UpdatedAt = inventory.UpdatedAt
        };
    }
}
