using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelMiniERP.Application.Reports.Queries;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardSummary()
    {
        try
        {
            var query = new GetDashboardSummaryQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("dashboard/mock")]
    public async Task<IActionResult> GetDashboardSummaryMock()
    {
        try
        {
            // Legacy mock endpoint for testing
            var mockDashboard = new
            {
                Assets = new
                {
                    TotalAssets = 125,
                    ActiveAssets = 118,
                    MaintenanceRequired = 7,
                    TotalValue = 485750.00m,
                    RecentlyAdded = 3
                },
                WorkOrders = new
                {
                    TotalWorkOrders = 89,
                    OpenWorkOrders = 25,
                    InProgressWorkOrders = 31,
                    CompletedThisMonth = 18,
                    HighPriorityWorkOrders = 8,
                    OverdueWorkOrders = 4
                },
                Inventory = new
                {
                    TotalInventory = 67,
                    AvailableInventory = 52,
                    InUseInventory = 12,
                    MaintenanceInventory = 3,
                    MaintenanceDueThisWeek = 5
                },
                Complaints = new
                {
                    CustomerComplaints = new
                    {
                        Total = 23,
                        Open = 8,
                        InProgress = 11,
                        ResolvedThisMonth = 15
                    },
                    WorkerComplaints = new
                    {
                        Total = 7,
                        Open = 3,
                        InProgress = 2,
                        ResolvedThisMonth = 5
                    }
                },
                Users = new
                {
                    TotalUsers = 45,
                    ActiveUsers = 42,
                    OnlineUsers = 18,
                    NewUsersThisMonth = 2
                }
            };

            return Ok(mockDashboard);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("assets/depreciation")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetAssetDepreciationReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = new GetAssetDepreciationReportQuery 
            { 
                StartDate = startDate, 
                EndDate = endDate 
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("assets/depreciation/mock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetAssetDepreciationReportMock([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // Legacy mock endpoint
            var mockReport = new
            {
                ReportPeriod = new
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddYears(-1),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                TotalDepreciation = 42500.00m,
                AssetsByCategory = new[]
                {
                    new { Category = "Electronics", TotalValue = 125000.00m, DepreciationAmount = 15000.00m, DepreciationPercentage = 12.0 },
                    new { Category = "Furniture", TotalValue = 85000.00m, DepreciationAmount = 8500.00m, DepreciationPercentage = 10.0 },
                    new { Category = "Inventory", TotalValue = 95000.00m, DepreciationAmount = 12000.00m, DepreciationPercentage = 12.6 },
                    new { Category = "Vehicles", TotalValue = 75000.00m, DepreciationAmount = 7000.00m, DepreciationPercentage = 9.3 }
                },
                TopDepreciatingAssets = new[]
                {
                    new { AssetName = "Conference Room Projector", CurrentValue = 1200.00m, OriginalValue = 1500.00m, DepreciationAmount = 300.00m },
                    new { AssetName = "Kitchen Refrigerator", CurrentValue = 2800.00m, OriginalValue = 3500.00m, DepreciationAmount = 700.00m },
                    new { AssetName = "Lobby Furniture Set", CurrentValue = 4200.00m, OriginalValue = 5000.00m, DepreciationAmount = 800.00m }
                }
            };

            return Ok(mockReport);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("workorders/performance")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetWorkOrderPerformanceReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = new GetWorkOrderPerformanceReportQuery 
            { 
                StartDate = startDate, 
                EndDate = endDate 
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("workorders/performance/mock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetWorkOrderPerformanceReportMock([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // Legacy mock endpoint
            var mockReport = new
            {
                ReportPeriod = new
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddMonths(-1),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                Summary = new
                {
                    TotalWorkOrders = 156,
                    CompletedWorkOrders = 142,
                    CompletionRate = 91.0,
                    AverageCompletionTime = "2.8 days",
                    OnTimeCompletionRate = 85.2
                },
                ByPriority = new[]
                {
                    new { Priority = "Critical", Total = 12, Completed = 12, AverageTime = "4.2 hours" },
                    new { Priority = "High", Total = 35, Completed = 33, AverageTime = "1.5 days" },
                    new { Priority = "Medium", Total = 78, Completed = 72, AverageTime = "3.2 days" },
                    new { Priority = "Low", Total = 31, Completed = 25, AverageTime = "5.8 days" }
                },
                ByAssignee = new[]
                {
                    new { AssigneeName = "John Maintenance", WorkOrdersCompleted = 45, AverageCompletionTime = "2.1 days", CompletionRate = 95.7 },
                    new { AssigneeName = "Sarah Tech", WorkOrdersCompleted = 38, AverageCompletionTime = "2.8 days", CompletionRate = 92.3 },
                    new { AssigneeName = "Mike Service", WorkOrdersCompleted = 32, AverageCompletionTime = "3.2 days", CompletionRate = 88.9 }
                }
            };

            return Ok(mockReport);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("inventory/utilization")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetInventoryUtilizationReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = new GetInventoryUtilizationReportQuery 
            { 
                StartDate = startDate, 
                EndDate = endDate 
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("inventory/utilization/mock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetInventoryUtilizationReportMock([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // Legacy mock endpoint
            var mockReport = new
            {
                ReportPeriod = new
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddMonths(-1),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                OverallUtilization = 78.5,
                ByCategory = new[]
                {
                    new { Category = "Cleaning Inventory", UtilizationRate = 85.2, TotalHours = 1245, AvailableHours = 1460 },
                    new { Category = "Kitchen Inventory", UtilizationRate = 92.1, TotalHours = 1658, AvailableHours = 1800 },
                    new { Category = "Maintenance Tools", UtilizationRate = 65.8, TotalHours = 789, AvailableHours = 1200 }
                },
                MostUsedInventory = new[]
                {
                    new { InventoryName = "Industrial Vacuum #1", UtilizationRate = 96.5, TotalHours = 347, Category = "Cleaning" },
                    new { InventoryName = "Floor Buffer", UtilizationRate = 88.2, TotalHours = 318, Category = "Cleaning" },
                    new { InventoryName = "Pressure Washer", UtilizationRate = 72.1, TotalHours = 259, Category = "Maintenance" }
                },
                UnderutilizedInventory = new[]
                {
                    new { InventoryName = "Carpet Cleaner #2", UtilizationRate = 23.4, TotalHours = 84, Category = "Cleaning" },
                    new { InventoryName = "Power Drill #3", UtilizationRate = 15.8, TotalHours = 57, Category = "Maintenance" }
                }
            };

            return Ok(mockReport);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("complaints/analysis")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetComplaintsAnalysisReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = new GetComplaintsAnalysisReportQuery 
            { 
                StartDate = startDate, 
                EndDate = endDate 
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("complaints/analysis/mock")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetComplaintsAnalysisReportMock([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // Legacy mock endpoint
            var mockReport = new
            {
                ReportPeriod = new
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddMonths(-3),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                CustomerComplaints = new
                {
                    Total = 89,
                    Resolved = 76,
                    ResolutionRate = 85.4,
                    AverageResolutionTime = "1.8 days",
                    ByCategory = new Dictionary<string, int>
                    {
                        { "Room Issues", 35 },
                        { "Service Quality", 28 },
                        { "Billing", 15 },
                        { "Amenities", 11 }
                    },
                    SatisfactionRating = 4.2,
                    Trends = new
                    {
                        ThisMonth = 25,
                        LastMonth = 32,
                        TrendDirection = "Decreasing"
                    }
                },
                WorkerComplaints = new
                {
                    Total = 23,
                    Resolved = 19,
                    ResolutionRate = 82.6,
                    AverageResolutionTime = "3.2 days",
                    ByCategory = new Dictionary<string, int>
                    {
                        { "Working Conditions", 8 },
                        { "Safety", 7 },
                        { "Inventory", 5 },
                        { "Management", 3 }
                    },
                    Trends = new
                    {
                        ThisMonth = 4,
                        LastMonth = 8,
                        TrendDirection = "Decreasing"
                    }
                }
            };

            return Ok(mockReport);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("financial/summary")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetFinancialSummaryReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = new GetFinancialSummaryReportQuery 
            { 
                StartDate = startDate, 
                EndDate = endDate 
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("financial/summary/mock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetFinancialSummaryReportMock([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // Legacy mock endpoint
            var mockReport = new
            {
                ReportPeriod = new
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddMonths(-12),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                AssetInvestments = new
                {
                    TotalPurchases = 125000.00m,
                    TotalAssetValue = 485750.00m,
                    DepreciationExpense = 42500.00m,
                    NetAssetValue = 443250.00m
                },
                MaintenanceCosts = new
                {
                    TotalMaintenanceCost = 28500.00m,
                    PreventiveMaintenance = 18200.00m,
                    EmergencyRepairs = 10300.00m,
                    ByCategory = new[]
                    {
                        new { Category = "HVAC", Cost = 12500.00m },
                        new { Category = "Plumbing", Cost = 8200.00m },
                        new { Category = "Electrical", Cost = 4800.00m },
                        new { Category = "Inventory", Cost = 3000.00m }
                    }
                },
                ROI = new
                {
                    MaintenanceROI = 3.2, // Every $1 spent on maintenance saves $3.20 in emergency repairs
                    AssetUtilizationValue = 67500.00m,
                    CostSavings = 15200.00m
                }
            };

            return Ok(mockReport);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("export/{reportType}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> ExportReport(string reportType, [FromQuery] string format = "pdf", [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        try
        {
            // TODO: Implement report export functionality
            // Support formats: pdf, excel, csv
            return Ok(new { Message = $"Export functionality for {reportType} in {format} format - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("custom")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetCustomReport([FromQuery] string query, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            // TODO: Implement custom report generation
            return Ok(new { Message = "Custom report generation - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}