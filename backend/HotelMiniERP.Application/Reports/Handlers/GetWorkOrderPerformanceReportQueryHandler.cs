using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetWorkOrderPerformanceReportQueryHandler : IRequestHandler<GetWorkOrderPerformanceReportQuery, WorkOrderPerformanceReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetWorkOrderPerformanceReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkOrderPerformanceReportDto> Handle(GetWorkOrderPerformanceReportQuery request, CancellationToken cancellationToken)
    {
        var startDate = request.StartDate.HasValue 
            ? DateTime.SpecifyKind(request.StartDate.Value.Date, DateTimeKind.Utc)
            : DateTime.UtcNow.Date.AddMonths(-1);
        var endDate = request.EndDate.HasValue
            ? DateTime.SpecifyKind(request.EndDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
            : DateTime.UtcNow.Date.AddDays(1).AddTicks(-1);

        var workOrders = await _context.WorkOrders
            .Include(w => w.AssignedToUser)
            .Where(w => w.RequestedDate >= startDate && w.RequestedDate <= endDate)
            .ToListAsync(cancellationToken);

        var totalWorkOrders = workOrders.Count;
        var completedWorkOrders = workOrders.Count(w => w.Status == WorkOrderStatus.Completed);
        var completionRate = totalWorkOrders > 0 ? (double)completedWorkOrders / totalWorkOrders * 100 : 0;

        // Calculate average completion time
        var completedWithDates = workOrders
            .Where(w => w.Status == WorkOrderStatus.Completed && 
                       w.CompletedDate.HasValue)
            .ToList();

        var averageCompletionTime = completedWithDates.Any() 
            ? TimeSpan.FromDays(completedWithDates.Average(w => (w.CompletedDate!.Value - w.RequestedDate).TotalDays))
            : TimeSpan.Zero;

        // On-time completion rate (completed before or on scheduled date)
        var onTimeCompleted = workOrders.Count(w => 
            w.Status == WorkOrderStatus.Completed && 
            w.ScheduledDate.HasValue && 
            w.CompletedDate.HasValue && 
            w.CompletedDate.Value <= w.ScheduledDate.Value);
        var onTimeRate = completedWorkOrders > 0 ? (double)onTimeCompleted / completedWorkOrders * 100 : 0;

        // By Priority
        var byPriority = Enum.GetValues<WorkOrderPriority>()
            .Select(priority => new PerformanceByPriorityDto
            {
                Priority = priority.ToString(),
                Total = workOrders.Count(w => w.Priority == priority),
                Completed = workOrders.Count(w => w.Priority == priority && w.Status == WorkOrderStatus.Completed),
                AverageTime = CalculateAverageTime(workOrders.Where(w => w.Priority == priority && w.Status == WorkOrderStatus.Completed))
            })
            .ToList();

        // By Assignee
        var byAssignee = workOrders
            .Where(w => w.AssignedToUser != null)
            .GroupBy(w => w.AssignedToUser!)
            .Select(g => new PerformanceByAssigneeDto
            {
                AssigneeName = $"{g.Key.FirstName} {g.Key.LastName}",
                WorkOrdersCompleted = g.Count(w => w.Status == WorkOrderStatus.Completed),
                AverageCompletionTime = CalculateAverageTime(g.Where(w => w.Status == WorkOrderStatus.Completed)),
                CompletionRate = g.Any() ? (double)g.Count(w => w.Status == WorkOrderStatus.Completed) / g.Count() * 100 : 0
            })
            .OrderByDescending(x => x.WorkOrdersCompleted)
            .ToList();

        return new WorkOrderPerformanceReportDto
        {
            ReportPeriod = new ReportPeriodDto
            {
                StartDate = startDate,
                EndDate = endDate
            },
            Summary = new PerformanceSummaryDto
            {
                TotalWorkOrders = totalWorkOrders,
                CompletedWorkOrders = completedWorkOrders,
                CompletionRate = Math.Round(completionRate, 1),
                AverageCompletionTime = FormatTimeSpan(averageCompletionTime),
                OnTimeCompletionRate = Math.Round(onTimeRate, 1)
            },
            ByPriority = byPriority,
            ByAssignee = byAssignee
        };
    }

    private string CalculateAverageTime(IEnumerable<Domain.Entities.WorkOrder> workOrders)
    {
        var completed = workOrders
            .Where(w => w.CompletedDate.HasValue && w.RequestedDate != null)
            .ToList();

        if (!completed.Any()) return "N/A";

        var avgTime = TimeSpan.FromDays(completed.Average(w => (w.CompletedDate!.Value - w.RequestedDate).TotalDays));
        return FormatTimeSpan(avgTime);
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

