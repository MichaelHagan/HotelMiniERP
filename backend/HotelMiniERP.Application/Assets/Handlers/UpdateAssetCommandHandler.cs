using HotelMiniERP.Application.Assets.Commands;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, AssetDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateAssetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AssetDto> Handle(UpdateAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (asset == null)
        {
            throw new InvalidOperationException($"Asset with ID {request.Id} not found.");
        }

        // Check if asset code is being changed and if it conflicts
        if (asset.AssetCode != request.AssetCode)
        {
            var existingAsset = await _context.Assets
                .FirstOrDefaultAsync(a => a.AssetCode == request.AssetCode && a.Id != request.Id, cancellationToken);

            if (existingAsset != null)
            {
                throw new InvalidOperationException($"Asset with code '{request.AssetCode}' already exists.");
            }
        }

        asset.AssetName = request.AssetName;
        asset.AssetCode = request.AssetCode;
        asset.Description = request.Description;
        asset.Category = request.Category;
        asset.PurchasePrice = request.PurchasePrice;
        asset.PurchaseDate = request.PurchaseDate;
        asset.Supplier = request.Supplier;
        asset.Location = request.Location;
        asset.Status = request.Status;
        asset.WarrantyExpiry = request.WarrantyExpiry;
        asset.SerialNumber = request.SerialNumber;
        asset.Model = request.Model;
        asset.Brand = request.Brand;
        asset.DepreciationRate = request.DepreciationRate;
        asset.Notes = request.Notes;
        asset.UpdatedAt = DateTime.UtcNow;

        // Recalculate current value based on depreciation
        asset.CurrentValue = CalculateCurrentValue(
            asset.PurchasePrice,
            asset.PurchaseDate,
            asset.DepreciationRate);

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
