using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Queries;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class GetEquipmentByIdQueryHandler : IRequestHandler<GetInventoryByIdQuery, InventoryDto?>
{
    private readonly IApplicationDbContext _context;

    public GetEquipmentByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryDto?> Handle(GetInventoryByIdQuery request, CancellationToken cancellationToken)
    {
        var inventory = await _context.Inventory
            .Where(e => e.Id == request.Id)
            .Select(e => new InventoryDto
            {
                Id = e.Id,
                Name = e.Name,
                Code = e.Code,
                Description = e.Description,
                Category = e.Category,
                Brand = e.Brand,
                Model = e.Model,
                SerialNumber = e.SerialNumber,
                Location = e.Location,
                Quantity = e.Quantity,
                MinimumStock = e.MinimumStock,
                UnitCost = e.UnitCost ?? 0,
                Supplier = e.Supplier,
                PurchaseDate = e.PurchaseDate,
                WarrantyExpiry = e.WarrantyExpiry,
                LastRestockedDate = e.LastRestockedDate,
                Notes = e.Notes,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return inventory;
    }
}
