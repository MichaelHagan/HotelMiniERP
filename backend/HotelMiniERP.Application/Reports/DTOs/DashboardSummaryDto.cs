namespace HotelMiniERP.Application.Reports.DTOs;

public class DashboardSummaryDto
{
    public AssetSummaryDto Assets { get; set; } = new();
    public WorkOrderSummaryDto WorkOrders { get; set; } = new();
    public EquipmentSummaryDto Equipment { get; set; } = new();
    public ComplaintsSummaryDto Complaints { get; set; } = new();
    public UserSummaryDto Users { get; set; } = new();
}

public class AssetSummaryDto
{
    public int TotalAssets { get; set; }
    public int ActiveAssets { get; set; }
    public int MaintenanceRequired { get; set; }
    public decimal TotalValue { get; set; }
    public int RecentlyAdded { get; set; }
}

public class WorkOrderSummaryDto
{
    public int TotalWorkOrders { get; set; }
    public int OpenWorkOrders { get; set; }
    public int InProgressWorkOrders { get; set; }
    public int CompletedThisMonth { get; set; }
    public int HighPriorityWorkOrders { get; set; }
    public int OverdueWorkOrders { get; set; }
}

public class EquipmentSummaryDto
{
    public int TotalEquipment { get; set; }
    public int AvailableEquipment { get; set; }
    public int InUseEquipment { get; set; }
    public int MaintenanceEquipment { get; set; }
    public int MaintenanceDueThisWeek { get; set; }
}

public class ComplaintsSummaryDto
{
    public ComplaintTypeSummaryDto CustomerComplaints { get; set; } = new();
    public ComplaintTypeSummaryDto WorkerComplaints { get; set; } = new();
}

public class ComplaintTypeSummaryDto
{
    public int Total { get; set; }
    public int Open { get; set; }
    public int InProgress { get; set; }
    public int ResolvedThisMonth { get; set; }
}

public class UserSummaryDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int OnlineUsers { get; set; }
    public int NewUsersThisMonth { get; set; }
}

