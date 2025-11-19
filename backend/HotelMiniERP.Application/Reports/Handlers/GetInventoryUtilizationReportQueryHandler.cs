using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetInventoryUtilizationReportQueryHandler : IRequestHandler<GetInventoryUtilizationReportQuery, InventoryUtilizationReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetInventoryUtilizationReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryUtilizationReportDto> Handle(GetInventoryUtilizationReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-1);
        var endDate = request.EndDate ?? DateTime.UtcNow;
        var daysInPeriod = (endDate - startDate).TotalDays;
        var totalHoursInPeriod = (int)(daysInPeriod * 24);

        var inventory = await _context.Inventory.ToListAsync(cancellationToken);

        // Calculate inventory utilization based on stock levels
        var totalInventory = inventory.Count;
        var lowStockCount = inventory.Count(e => e.MinimumStock.HasValue && e.Quantity <= e.MinimumStock.Value);
        var overallUtilization = totalInventory > 0 ? (double)(totalInventory - lowStockCount) / totalInventory * 100 : 0;

        // By Category
        var byCategory = inventory
            .GroupBy(e => e.Category)
            .Select(g => new UtilizationByCategoryDto
            {
                Category = g.Key,
                UtilizationRate = g.Any() ? (double)(g.Count() - g.Count(e => e.MinimumStock.HasValue && e.Quantity <= e.MinimumStock.Value)) / g.Count() * 100 : 0,
                TotalHours = g.Sum(e => e.Quantity) * totalHoursInPeriod,
                AvailableHours = g.Count() * totalHoursInPeriod
            })
            .ToList();

        // Most stocked items
        var mostUsed = inventory
            .OrderByDescending(e => e.Quantity)
            .Select(e => new MostUsedInventoryDto
            {
                InventoryName = e.Name,
                UtilizationRate = e.MinimumStock.HasValue && e.MinimumStock.Value > 0 
                    ? (double)e.Quantity / e.MinimumStock.Value * 100 
                    : 100.0,
                TotalHours = e.Quantity * totalHoursInPeriod,
                Category = e.Category
            })
            .Take(10)
            .ToList();

        // Low stock items
        var underutilized = inventory
            .Where(e => e.MinimumStock.HasValue && e.Quantity <= e.MinimumStock.Value)
            .Select(e => new UnderutilizedInventoryDto
            {
                InventoryName = e.Name,
                UtilizationRate = e.MinimumStock.HasValue && e.MinimumStock.Value > 0 
                    ? (double)e.Quantity / e.MinimumStock.Value * 100 
                    : 0,
                TotalHours = e.Quantity,
                Category = e.Category
            })
            .OrderBy(e => e.UtilizationRate)
            .Take(10)
            .ToList();

        return new InventoryUtilizationReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            OverallUtilization = Math.Round(overallUtilization, 1),
            ByCategory = byCategory,
            MostUsedInventory = mostUsed,
            UnderutilizedInventory = underutilized
        };
    }
}

