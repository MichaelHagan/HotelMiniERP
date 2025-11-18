namespace HotelMiniERP.Application.Reports.DTOs;

public class ComplaintsAnalysisReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public ComplaintTypeAnalysisDto CustomerComplaints { get; set; } = new();
    public ComplaintTypeAnalysisDto WorkerComplaints { get; set; } = new();
}

public class ComplaintTypeAnalysisDto
{
    public int Total { get; set; }
    public int Resolved { get; set; }
    public double ResolutionRate { get; set; }
    public string AverageResolutionTime { get; set; } = string.Empty;
    public Dictionary<string, int> ByCategory { get; set; } = new();
    public double? SatisfactionRating { get; set; }
    public ComplaintTrendsDto Trends { get; set; } = new();
}

public class ComplaintTrendsDto
{
    public int ThisMonth { get; set; }
    public int LastMonth { get; set; }
    public string TrendDirection { get; set; } = string.Empty;
}

