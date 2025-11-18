namespace HotelMiniERP.Application.Reports.DTOs;

public class FinancialSummaryReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public AssetInvestmentsDto AssetInvestments { get; set; } = new();
    public MaintenanceCostsDto MaintenanceCosts { get; set; } = new();
    public RoiDto ROI { get; set; } = new();
}

public class AssetInvestmentsDto
{
    public decimal TotalPurchases { get; set; }
    public decimal TotalAssetValue { get; set; }
    public decimal DepreciationExpense { get; set; }
    public decimal NetAssetValue { get; set; }
}

public class MaintenanceCostsDto
{
    public decimal TotalMaintenanceCost { get; set; }
    public decimal PreventiveMaintenance { get; set; }
    public decimal EmergencyRepairs { get; set; }
    public List<CostByCategoryDto> ByCategory { get; set; } = new();
}

public class CostByCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Cost { get; set; }
}

public class RoiDto
{
    public double MaintenanceROI { get; set; }
    public decimal AssetUtilizationValue { get; set; }
    public decimal CostSavings { get; set; }
}

