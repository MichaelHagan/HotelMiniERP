namespace HotelMiniERP.Application.Reports.DTOs;

public class EquipmentUtilizationReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public double OverallUtilization { get; set; }
    public List<UtilizationByCategoryDto> ByCategory { get; set; } = new();
    public List<MostUsedEquipmentDto> MostUsedEquipment { get; set; } = new();
    public List<UnderutilizedEquipmentDto> UnderutilizedEquipment { get; set; } = new();
}

public class UtilizationByCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public int AvailableHours { get; set; }
}

public class MostUsedEquipmentDto
{
    public string EquipmentName { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class UnderutilizedEquipmentDto
{
    public string EquipmentName { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public string Category { get; set; } = string.Empty;
}

