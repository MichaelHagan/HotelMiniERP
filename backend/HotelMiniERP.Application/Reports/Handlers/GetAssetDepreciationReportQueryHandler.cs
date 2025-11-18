using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetAssetDepreciationReportQueryHandler : IRequestHandler<GetAssetDepreciationReportQuery, AssetDepreciationReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetAssetDepreciationReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AssetDepreciationReportDto> Handle(GetAssetDepreciationReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddYears(-1);
        var endDate = request.EndDate ?? DateTime.UtcNow;

        var assets = await _context.Assets
            .Where(a => a.PurchaseDate <= endDate && 
                       (a.PurchaseDate >= startDate || a.UpdatedAt >= startDate))
            .ToListAsync(cancellationToken);

        var totalDepreciation = assets
            .Where(a => a.PurchasePrice > 0 && a.CurrentValue.HasValue)
            .Sum(a => a.PurchasePrice - a.CurrentValue!.Value);

        // Group by category
        var assetsByCategory = assets
            .Where(a => a.PurchasePrice > 0 && a.CurrentValue.HasValue)
            .GroupBy(a => a.Category)
            .Select(g => new AssetCategoryDepreciationDto
            {
                Category = g.Key,
                TotalValue = g.Sum(a => a.CurrentValue!.Value),
                DepreciationAmount = g.Sum(a => a.PurchasePrice - a.CurrentValue!.Value),
                DepreciationPercentage = g.Average(a => 
                    a.PurchasePrice > 0 ? (double)((a.PurchasePrice - a.CurrentValue!.Value) / a.PurchasePrice * 100) : 0)
            })
            .OrderByDescending(x => x.DepreciationAmount)
            .ToList();

        // Top depreciating assets
        var topDepreciatingAssets = assets
            .Where(a => a.PurchasePrice > 0 && a.CurrentValue.HasValue)
            .Select(a => new TopDepreciatingAssetDto
            {
                AssetName = a.AssetName,
                CurrentValue = a.CurrentValue!.Value,
                OriginalValue = a.PurchasePrice,
                DepreciationAmount = a.PurchasePrice - a.CurrentValue!.Value
            })
            .OrderByDescending(a => a.DepreciationAmount)
            .Take(10)
            .ToList();

        return new AssetDepreciationReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            TotalDepreciation = totalDepreciation,
            AssetsByCategory = assetsByCategory,
            TopDepreciatingAssets = topDepreciatingAssets
        };
    }
}

