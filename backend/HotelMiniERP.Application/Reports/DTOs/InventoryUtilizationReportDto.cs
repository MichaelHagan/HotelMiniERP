namespace HotelMiniERP.Application.Reports.DTOs;

public class InventoryUtilizationReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public double OverallUtilization { get; set; }
    public List<UtilizationByCategoryDto> ByCategory { get; set; } = new();
    public List<MostUsedInventoryDto> MostUsedInventory { get; set; } = new();
    public List<UnderutilizedInventoryDto> UnderutilizedInventory { get; set; } = new();
}

public class UtilizationByCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public int AvailableHours { get; set; }
}

public class MostUsedInventoryDto
{
    public string InventoryName { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class UnderutilizedInventoryDto
{
    public string InventoryName { get; set; } = string.Empty;
    public double UtilizationRate { get; set; }
    public int TotalHours { get; set; }
    public string Category { get; set; } = string.Empty;
}

