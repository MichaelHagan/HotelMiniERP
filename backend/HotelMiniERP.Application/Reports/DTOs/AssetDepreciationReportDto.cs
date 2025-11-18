namespace HotelMiniERP.Application.Reports.DTOs;

public class AssetDepreciationReportDto
{
    public ReportPeriodDto ReportPeriod { get; set; } = new();
    public decimal TotalDepreciation { get; set; }
    public List<AssetCategoryDepreciationDto> AssetsByCategory { get; set; } = new();
    public List<TopDepreciatingAssetDto> TopDepreciatingAssets { get; set; } = new();
}

public class ReportPeriodDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class AssetCategoryDepreciationDto
{
    public string Category { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public double DepreciationPercentage { get; set; }
}

public class TopDepreciatingAssetDto
{
    public string AssetName { get; set; } = string.Empty;
    public decimal CurrentValue { get; set; }
    public decimal OriginalValue { get; set; }
    public decimal DepreciationAmount { get; set; }
}

