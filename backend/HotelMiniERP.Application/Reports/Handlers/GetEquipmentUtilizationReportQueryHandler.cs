using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetEquipmentUtilizationReportQueryHandler : IRequestHandler<GetEquipmentUtilizationReportQuery, EquipmentUtilizationReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetEquipmentUtilizationReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EquipmentUtilizationReportDto> Handle(GetEquipmentUtilizationReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-1);
        var endDate = request.EndDate ?? DateTime.UtcNow;
        var daysInPeriod = (endDate - startDate).TotalDays;
        var totalHoursInPeriod = (int)(daysInPeriod * 24);

        var equipment = await _context.Equipment.ToListAsync(cancellationToken);

        // Calculate utilization based on status
        // InUse = 100%, Available = 0%, UnderMaintenance = 0%, OutOfOrder = 0%
        var totalEquipment = equipment.Count;
        var inUseCount = equipment.Count(e => e.Status == EquipmentStatus.InUse);
        var overallUtilization = totalEquipment > 0 ? (double)inUseCount / totalEquipment * 100 : 0;

        // By Category
        var byCategory = equipment
            .GroupBy(e => e.Category)
            .Select(g => new UtilizationByCategoryDto
            {
                Category = g.Key,
                UtilizationRate = g.Any() ? (double)g.Count(e => e.Status == EquipmentStatus.InUse) / g.Count() * 100 : 0,
                TotalHours = g.Count(e => e.Status == EquipmentStatus.InUse) * totalHoursInPeriod,
                AvailableHours = g.Count() * totalHoursInPeriod
            })
            .ToList();

        // Most used equipment (currently in use)
        var mostUsed = equipment
            .Where(e => e.Status == EquipmentStatus.InUse)
            .Select(e => new MostUsedEquipmentDto
            {
                EquipmentName = e.Name,
                UtilizationRate = 100.0, // Currently in use
                TotalHours = totalHoursInPeriod,
                Category = e.Category
            })
            .OrderByDescending(e => e.UtilizationRate)
            .Take(10)
            .ToList();

        // Underutilized equipment (available but not used)
        var underutilized = equipment
            .Where(e => e.Status == EquipmentStatus.Available)
            .Select(e => new UnderutilizedEquipmentDto
            {
                EquipmentName = e.Name,
                UtilizationRate = 0.0, // Available but not used
                TotalHours = 0,
                Category = e.Category
            })
            .OrderBy(e => e.UtilizationRate)
            .Take(10)
            .ToList();

        return new EquipmentUtilizationReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            OverallUtilization = Math.Round(overallUtilization, 1),
            ByCategory = byCategory,
            MostUsedEquipment = mostUsed,
            UnderutilizedEquipment = underutilized
        };
    }
}

