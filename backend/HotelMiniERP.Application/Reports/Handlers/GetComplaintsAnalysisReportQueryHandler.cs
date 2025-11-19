using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetComplaintsAnalysisReportQueryHandler : IRequestHandler<GetComplaintsAnalysisReportQuery, ComplaintsAnalysisReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetComplaintsAnalysisReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ComplaintsAnalysisReportDto> Handle(GetComplaintsAnalysisReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate ?? DateTime.UtcNow.AddMonths(-3);
        var endDate = request.EndDate ?? DateTime.UtcNow;
        var startOfThisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfLastMonth = startOfThisMonth.AddMonths(-1);
        var endOfLastMonth = startOfThisMonth.AddDays(-1);

        // Customer Complaints
        var customerComplaints = await _context.CustomerComplaints
            .Where(c => c.CreatedAt >= startDate && c.CreatedAt <= endDate)
            .ToListAsync(cancellationToken);

        var customerTotal = customerComplaints.Count;
        var customerResolved = customerComplaints.Count(c => c.Status == ComplaintStatus.Resolved || c.Status == ComplaintStatus.Closed);
        var customerResolutionRate = customerTotal > 0 ? (double)customerResolved / customerTotal * 100 : 0;

        var customerResolvedWithDates = customerComplaints
            .Where(c => (c.Status == ComplaintStatus.Resolved || c.Status == ComplaintStatus.Closed) && 
                       c.ResolvedDate.HasValue)
            .ToList();

        var customerAvgResolutionTime = customerResolvedWithDates.Any()
            ? TimeSpan.FromDays(customerResolvedWithDates.Average(c => (c.ResolvedDate!.Value - c.CreatedAt).TotalDays))
            : TimeSpan.Zero;

        var customerByCategory = customerComplaints
            .GroupBy(c => c.Category)
            .ToDictionary(g => g.Key, g => g.Count());

        var customerThisMonth = customerComplaints.Count(c => c.CreatedAt >= startOfThisMonth);
        var customerLastMonth = await _context.CustomerComplaints
            .CountAsync(c => c.CreatedAt >= startOfLastMonth && c.CreatedAt <= endOfLastMonth, cancellationToken);

        // Worker Complaints
        var workerComplaints = await _context.WorkerComplaints
            .Where(c => c.CreatedAt >= startDate && c.CreatedAt <= endDate)
            .ToListAsync(cancellationToken);

        var workerTotal = workerComplaints.Count;
        var workerResolved = workerComplaints.Count(c => c.Status == ComplaintStatus.Resolved || c.Status == ComplaintStatus.Closed);
        var workerResolutionRate = workerTotal > 0 ? (double)workerResolved / workerTotal * 100 : 0;

        var workerResolvedWithDates = workerComplaints
            .Where(c => (c.Status == ComplaintStatus.Resolved || c.Status == ComplaintStatus.Closed) && 
                       c.ResolvedDate.HasValue)
            .ToList();

        var workerAvgResolutionTime = workerResolvedWithDates.Any()
            ? TimeSpan.FromDays(workerResolvedWithDates.Average(c => (c.ResolvedDate!.Value - c.CreatedAt).TotalDays))
            : TimeSpan.Zero;

        var workerByCategory = workerComplaints
            .GroupBy(c => c.Category)
            .ToDictionary(g => g.Key, g => g.Count());

        var workerThisMonth = workerComplaints.Count(c => c.CreatedAt >= startOfThisMonth);
        var workerLastMonth = await _context.WorkerComplaints
            .CountAsync(c => c.CreatedAt >= startOfLastMonth && c.CreatedAt <= endOfLastMonth, cancellationToken);

        return new ComplaintsAnalysisReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            CustomerComplaints = new ComplaintTypeAnalysisDto
            {
                Total = customerTotal,
                Resolved = customerResolved,
                ResolutionRate = Math.Round(customerResolutionRate, 1),
                AverageResolutionTime = FormatTimeSpan(customerAvgResolutionTime),
                ByCategory = customerByCategory,
                SatisfactionRating = null, // Would need additional field in entity
                Trends = new ComplaintTrendsDto
                {
                    ThisMonth = customerThisMonth,
                    LastMonth = customerLastMonth,
                    TrendDirection = customerThisMonth > customerLastMonth ? "Increasing" : 
                                    customerThisMonth < customerLastMonth ? "Decreasing" : "Stable"
                }
            },
            WorkerComplaints = new ComplaintTypeAnalysisDto
            {
                Total = workerTotal,
                Resolved = workerResolved,
                ResolutionRate = Math.Round(workerResolutionRate, 1),
                AverageResolutionTime = FormatTimeSpan(workerAvgResolutionTime),
                ByCategory = workerByCategory,
                SatisfactionRating = null,
                Trends = new ComplaintTrendsDto
                {
                    ThisMonth = workerThisMonth,
                    LastMonth = workerLastMonth,
                    TrendDirection = workerThisMonth > workerLastMonth ? "Increasing" : 
                                    workerThisMonth < workerLastMonth ? "Decreasing" : "Stable"
                }
            }
        };
    }

    private string FormatTimeSpan(TimeSpan timeSpan)
    {
        if (timeSpan.TotalDays >= 1)
            return $"{timeSpan.TotalDays:F1} days";
        if (timeSpan.TotalHours >= 1)
            return $"{timeSpan.TotalHours:F1} hours";
        return $"{timeSpan.TotalMinutes:F0} minutes";
    }
}

