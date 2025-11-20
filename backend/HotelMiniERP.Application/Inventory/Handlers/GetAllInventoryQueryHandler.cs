using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Queries;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class GetAllInventoryQueryHandler : IRequestHandler<GetAllInventoryQuery, PaginatedResponse<InventoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllInventoryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<InventoryDto>> Handle(GetAllInventoryQuery request, CancellationToken cancellationToken)
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

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        var inventory = await query
            .OrderBy(e => e.Name)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new InventoryDto
            {
                Id = e.Id,
                Name = e.Name,
                Code = e.Code,
                Description = e.Description,
                Category = e.Category,
                Brand = e.Brand,
                Model = e.Model,
                Location = e.Location ?? string.Empty,
                Quantity = e.Quantity,
                MinimumStock = e.MinimumStock,
                UnitCost = e.UnitCost,
                VendorId = e.VendorId,
                VendorName = e.Vendor != null ? e.Vendor.Name : null,
                LastRestockedDate = e.LastRestockedDate,
                Notes = e.Notes,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<InventoryDto>
        {
            Data = inventory,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
