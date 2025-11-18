namespace HotelMiniERP.Application.Reports.DTOs;

public class WorkOrderPerformanceReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public PerformanceSummaryDto Summary { get; set; } = new();
    public List<PerformanceByPriorityDto> ByPriority { get; set; } = new();
    public List<PerformanceByAssigneeDto> ByAssignee { get; set; } = new();
}

public class PerformanceSummaryDto
{
    public int TotalWorkOrders { get; set; }
    public int CompletedWorkOrders { get; set; }
    public double CompletionRate { get; set; }
    public string AverageCompletionTime { get; set; } = string.Empty;
    public double OnTimeCompletionRate { get; set; }
}

public class PerformanceByPriorityDto
{
    public string Priority { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Completed { get; set; }
    public string AverageTime { get; set; } = string.Empty;
}

public class PerformanceByAssigneeDto
{
    public string AssigneeName { get; set; } = string.Empty;
    public int WorkOrdersCompleted { get; set; }
    public string AverageCompletionTime { get; set; } = string.Empty;
    public double CompletionRate { get; set; }
}

