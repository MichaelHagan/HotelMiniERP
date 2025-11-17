using HotelMiniERP.Application.Assets.Queries;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class GetAssetByIdQueryHandler : IRequestHandler<GetAssetByIdQuery, AssetDto?>
{
    private readonly IApplicationDbContext _context;

    public GetAssetByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AssetDto?> Handle(GetAssetByIdQuery request, CancellationToken cancellationToken)
    {
        var asset = await _context.Assets
            .Where(a => a.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);

        return asset;
    }
}
