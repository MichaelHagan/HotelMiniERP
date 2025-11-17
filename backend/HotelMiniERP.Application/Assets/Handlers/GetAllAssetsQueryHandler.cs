using HotelMiniERP.Application.Assets.Queries;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class GetAllAssetsQueryHandler : IRequestHandler<GetAllAssetsQuery, List<AssetDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllAssetsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AssetDto>> Handle(GetAllAssetsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Assets.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(a => a.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<AssetStatus>(request.Status, out var status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(a =>
                a.AssetName.ToLower().Contains(searchTerm) ||
                a.AssetCode.ToLower().Contains(searchTerm) ||
                a.Description.ToLower().Contains(searchTerm) ||
                a.Location.ToLower().Contains(searchTerm));
        }

        var assets = await query
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetName = a.AssetName,
                AssetCode = a.AssetCode,
                Description = a.Description,
                Category = a.Category,
                PurchasePrice = a.PurchasePrice,
                PurchaseDate = a.PurchaseDate,
                Supplier = a.Supplier,
                Location = a.Location,
                Status = a.Status,
                WarrantyExpiry = a.WarrantyExpiry,
                SerialNumber = a.SerialNumber,
                Model = a.Model,
                Brand = a.Brand,
                DepreciationRate = a.DepreciationRate,
                CurrentValue = a.CurrentValue,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return assets;
    }
}
