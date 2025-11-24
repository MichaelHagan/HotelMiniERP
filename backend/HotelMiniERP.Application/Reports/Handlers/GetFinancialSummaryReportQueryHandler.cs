using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetFinancialSummaryReportQueryHandler : IRequestHandler<GetFinancialSummaryReportQuery, FinancialSummaryReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetFinancialSummaryReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FinancialSummaryReportDto> Handle(GetFinancialSummaryReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate.HasValue 
            ? DateTime.SpecifyKind(request.StartDate.Value.Date, DateTimeKind.Utc)
            : DateTime.UtcNow.Date.AddMonths(-12);
        var endDate = request.EndDate.HasValue
            ? DateTime.SpecifyKind(request.EndDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
            : DateTime.UtcNow.Date.AddDays(1).AddTicks(-1);

        // Asset Investments
        var assetsInPeriod = await _context.Assets
            .Where(a => a.PurchaseDate >= startDate && a.PurchaseDate <= endDate)
            .ToListAsync(cancellationToken);

        var totalPurchases = assetsInPeriod.Sum(a => a.PurchasePrice);
        var totalAssetValue = await _context.Assets
            .Where(a => a.CurrentValue.HasValue)
            .SumAsync(a => a.CurrentValue!.Value, cancellationToken);
        var depreciationExpense = await _context.Assets
            .Where(a => a.PurchasePrice > 0 && a.CurrentValue.HasValue)
            .SumAsync(a => a.PurchasePrice - a.CurrentValue!.Value, cancellationToken);
        var netAssetValue = totalAssetValue;

        // Maintenance Costs (from Work Orders)
        var workOrdersInPeriod = await _context.WorkOrders
            .Where(w => w.RequestedDate >= startDate && w.RequestedDate <= endDate)
            .ToListAsync(cancellationToken);

        var totalMaintenanceCost = workOrdersInPeriod
            .Where(w => w.ActualCost.HasValue)
            .Sum(w => w.ActualCost!.Value);

        // Estimate preventive vs emergency (preventive = scheduled, emergency = high priority)
        var preventiveMaintenance = workOrdersInPeriod
            .Where(w => w.ActualCost.HasValue && 
                       w.ScheduledDate.HasValue && 
                       w.Priority != WorkOrderPriority.Urgent)
            .Sum(w => w.ActualCost!.Value);

        var emergencyRepairs = workOrdersInPeriod
            .Where(w => w.ActualCost.HasValue && 
                       (w.Priority == WorkOrderPriority.Urgent || !w.ScheduledDate.HasValue))
            .Sum(w => w.ActualCost!.Value);

        // By Category (using WorkType as category)
        var byCategory = workOrdersInPeriod
            .Where(w => w.ActualCost.HasValue && !string.IsNullOrEmpty(w.WorkType))
            .GroupBy(w => w.WorkType!)
            .Select(g => new CostByCategoryDto
            {
                Category = g.Key,
                Cost = g.Sum(w => w.ActualCost!.Value)
            })
            .OrderByDescending(x => x.Cost)
            .ToList();

        // ROI Calculation (simplified)
        // Maintenance ROI: Every $1 spent on preventive maintenance saves $X in emergency repairs
        var maintenanceROI = preventiveMaintenance > 0 
            ? (double)(emergencyRepairs / preventiveMaintenance) 
            : 0;

        // Asset utilization value (estimated based on active assets)
        var activeAssets = await _context.Assets
            .CountAsync(a => a.Status == AssetStatus.Active, cancellationToken);
        var assetUtilizationValue = activeAssets * 1000m; // Estimated value per active asset

        // Cost savings (estimated)
        var costSavings = preventiveMaintenance * 0.3m; // 30% savings from preventive maintenance

        return new FinancialSummaryReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            AssetInvestments = new AssetInvestmentsDto
            {
                TotalPurchases = totalPurchases,
                TotalAssetValue = totalAssetValue,
                DepreciationExpense = depreciationExpense,
                NetAssetValue = netAssetValue
            },
            MaintenanceCosts = new MaintenanceCostsDto
            {
                TotalMaintenanceCost = totalMaintenanceCost,
                PreventiveMaintenance = preventiveMaintenance,
                EmergencyRepairs = emergencyRepairs,
                ByCategory = byCategory
            },
            ROI = new RoiDto
            {
                MaintenanceROI = Math.Round(maintenanceROI, 2),
                AssetUtilizationValue = assetUtilizationValue,
                CostSavings = costSavings
            }
        };
    }
}

