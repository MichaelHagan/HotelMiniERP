using HotelMiniERP.Application.Assets.Commands;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, AssetDto>
{
    private readonly IApplicationDbContext _context;

    public CreateAssetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AssetDto> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        // Check if asset code already exists
        var existingAsset = await _context.Assets
            .FirstOrDefaultAsync(a => a.AssetCode == request.AssetCode, cancellationToken);

        if (existingAsset != null)
        {
            throw new InvalidOperationException($"Asset with code '{request.AssetCode}' already exists.");
        }

        var asset = new Asset
        {
            AssetName = request.AssetName,
            AssetCode = request.AssetCode,
            Description = request.Description,
            Category = request.Category,
            PurchasePrice = request.PurchasePrice,
            PurchaseDate = request.PurchaseDate,
            Supplier = request.Supplier,
            Location = request.Location,
            Status = request.Status,
            WarrantyExpiry = request.WarrantyExpiry,
            SerialNumber = request.SerialNumber,
            Model = request.Model,
            Brand = request.Brand,
            DepreciationRate = request.DepreciationRate,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Auto-calculate current value based on depreciation
        asset.CurrentValue = CalculateCurrentValue(
            asset.PurchasePrice,
            asset.PurchaseDate,
            asset.DepreciationRate);

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return new AssetDto
        {
            Id = asset.Id,
            AssetName = asset.AssetName,
            AssetCode = asset.AssetCode,
            Description = asset.Description,
            Category = asset.Category,
            PurchasePrice = asset.PurchasePrice,
            PurchaseDate = asset.PurchaseDate,
            Supplier = asset.Supplier,
            Location = asset.Location,
            Status = asset.Status,
            WarrantyExpiry = asset.WarrantyExpiry,
            SerialNumber = asset.SerialNumber,
            Model = asset.Model,
            Brand = asset.Brand,
            DepreciationRate = asset.DepreciationRate,
            CurrentValue = asset.CurrentValue,
            Notes = asset.Notes,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt
        };
    }

    private decimal CalculateCurrentValue(decimal purchasePrice, DateTime purchaseDate, decimal? depreciationRate)
    {
        if (!depreciationRate.HasValue || depreciationRate.Value == 0)
        {
            return purchasePrice;
        }

        var yearsElapsed = (DateTime.UtcNow - purchaseDate).TotalDays / 365.25;
        var depreciationFactor = 1 - (depreciationRate.Value / 100);
        var currentValue = purchasePrice * (decimal)Math.Pow((double)depreciationFactor, yearsElapsed);

        return Math.Max(0, Math.Round(currentValue, 2));
    }
}
