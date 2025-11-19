using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Reports.DTOs;
using HotelMiniERP.Application.Reports.Queries;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Reports.Handlers;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardSummaryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        Console.WriteLine("\n\n\n\n\n\n\n Handling GetDashboardSummaryQuery... \n\n\n\n\n\n\n");
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var thirtyDaysAgo = now.AddDays(-30);
        var oneWeekFromNow = now.AddDays(7);

        // Assets Summary
        var totalAssets = await _context.Assets.CountAsync(cancellationToken);
        var activeAssets = await _context.Assets.CountAsync(a => a.Status == AssetStatus.Active, cancellationToken);
        var maintenanceRequired = await _context.Assets.CountAsync(a => a.Status == AssetStatus.UnderMaintenance, cancellationToken);
        var totalValue = await _context.Assets
            .Where(a => a.CurrentValue.HasValue)
            .SumAsync(a => a.CurrentValue!.Value, cancellationToken);
        var recentlyAdded = await _context.Assets
            .CountAsync(a => a.CreatedAt >= thirtyDaysAgo, cancellationToken);

        // Work Orders Summary
        var totalWorkOrders = await _context.WorkOrders.CountAsync(cancellationToken);
        var openWorkOrders = await _context.WorkOrders.CountAsync(w => w.Status == WorkOrderStatus.Created, cancellationToken);
        var inProgressWorkOrders = await _context.WorkOrders.CountAsync(w => w.Status == WorkOrderStatus.InProgress, cancellationToken);
        var completedThisMonth = await _context.WorkOrders
            .CountAsync(w => w.Status == WorkOrderStatus.Completed && 
                           w.CompletedDate.HasValue && 
                           w.CompletedDate.Value >= startOfMonth, cancellationToken);
        var highPriorityWorkOrders = await _context.WorkOrders
            .CountAsync(w => w.Priority == WorkOrderPriority.High || w.Priority == WorkOrderPriority.Urgent, cancellationToken);
        var overdueWorkOrders = await _context.WorkOrders
            .CountAsync(w => w.ScheduledDate.HasValue && 
                           w.ScheduledDate.Value < now && 
                           w.Status != WorkOrderStatus.Completed && 
                           w.Status != WorkOrderStatus.Cancelled, cancellationToken);

        // Inventory Summary
        var totalInventory = await _context.Inventory.CountAsync(cancellationToken);
        var lowStockItems = await _context.Inventory.CountAsync(e => e.MinimumStock.HasValue && e.Quantity <= e.MinimumStock.Value, cancellationToken);
        var inStockItems = await _context.Inventory.CountAsync(e => !e.MinimumStock.HasValue || e.Quantity > e.MinimumStock.Value, cancellationToken);
        var outOfStockItems = await _context.Inventory.CountAsync(e => e.Quantity == 0, cancellationToken);
        var restockNeededCount = lowStockItems;

        // Complaints Summary
        var customerComplaintsTotal = await _context.CustomerComplaints.CountAsync(cancellationToken);
        var customerComplaintsOpen = await _context.CustomerComplaints.CountAsync(c => c.Status == ComplaintStatus.Open, cancellationToken);
        var customerComplaintsInProgress = await _context.CustomerComplaints.CountAsync(c => c.Status == ComplaintStatus.InProgress, cancellationToken);
        var customerComplaintsResolvedThisMonth = await _context.CustomerComplaints
            .CountAsync(c => c.Status == ComplaintStatus.Resolved && 
                           c.ResolvedDate.HasValue && 
                           c.ResolvedDate.Value >= startOfMonth, cancellationToken);

        var workerComplaintsTotal = await _context.WorkerComplaints.CountAsync(cancellationToken);
        var workerComplaintsOpen = await _context.WorkerComplaints.CountAsync(c => c.Status == ComplaintStatus.Open, cancellationToken);
        var workerComplaintsInProgress = await _context.WorkerComplaints.CountAsync(c => c.Status == ComplaintStatus.InProgress, cancellationToken);
        var workerComplaintsResolvedThisMonth = await _context.WorkerComplaints
            .CountAsync(c => c.Status == ComplaintStatus.Resolved && 
                           c.ResolvedDate.HasValue && 
                           c.ResolvedDate.Value >= startOfMonth, cancellationToken);

        // Users Summary
        var totalUsers = await _context.Users.CountAsync(cancellationToken);
        var activeUsers = await _context.Users.CountAsync(u => u.IsActive, cancellationToken);
        var onlineUsers = await _context.Users
            .CountAsync(u => u.LastLogin.HasValue && 
                           u.LastLogin.Value >= now.AddHours(-1), cancellationToken);
        var newUsersThisMonth = await _context.Users
            .CountAsync(u => u.CreatedAt >= startOfMonth, cancellationToken);
        

        var result = new DashboardSummaryDto
        {
            Assets = new AssetSummaryDto
            {
                TotalAssets = totalAssets,
                ActiveAssets = activeAssets,
                MaintenanceRequired = maintenanceRequired,
                TotalValue = totalValue,
                RecentlyAdded = recentlyAdded
            },
            WorkOrders = new WorkOrderSummaryDto
            {
                TotalWorkOrders = totalWorkOrders,
                OpenWorkOrders = openWorkOrders,
                InProgressWorkOrders = inProgressWorkOrders,
                CompletedThisMonth = completedThisMonth,
                HighPriorityWorkOrders = highPriorityWorkOrders,
                OverdueWorkOrders = overdueWorkOrders
            },
            Inventory = new InventorySummaryDto
            {
                TotalInventory = totalInventory,
                AvailableInventory = inStockItems,
                InUseInventory = lowStockItems,
                MaintenanceInventory = outOfStockItems,
                MaintenanceDueThisWeek = restockNeededCount
            },
            Complaints = new ComplaintsSummaryDto
            {
                CustomerComplaints = new ComplaintTypeSummaryDto
                {
                    Total = customerComplaintsTotal,
                    Open = customerComplaintsOpen,
                    InProgress = customerComplaintsInProgress,
                    ResolvedThisMonth = customerComplaintsResolvedThisMonth
                },
                WorkerComplaints = new ComplaintTypeSummaryDto
                {
                    Total = workerComplaintsTotal,
                    Open = workerComplaintsOpen,
                    InProgress = workerComplaintsInProgress,
                    ResolvedThisMonth = workerComplaintsResolvedThisMonth
                }
            },
            Users = new UserSummaryDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                OnlineUsers = onlineUsers,
                NewUsersThisMonth = newUsersThisMonth
            }
        };

        return result;
    }
}

