using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Queries;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class GetAllEquipmentQueryHandler : IRequestHandler<GetAllInventoryQuery, List<InventoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllEquipmentQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<InventoryDto>> Handle(GetAllInventoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Inventory.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(e => e.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            query = query.Where(e => e.Location == request.Location);
        }

        var inventory = await query
            .OrderBy(e => e.Name)
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
                Location = e.Location ?? string.Empty,
                Quantity = e.Quantity,
                MinimumStock = e.MinimumStock,
                UnitCost = e.UnitCost,
                Supplier = e.Supplier,
                PurchaseDate = e.PurchaseDate,
                WarrantyExpiry = e.WarrantyExpiry,
                LastRestockedDate = e.LastRestockedDate,
                Notes = e.Notes,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return inventory;
    }
}
