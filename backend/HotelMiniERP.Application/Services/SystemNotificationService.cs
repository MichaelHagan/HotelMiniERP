using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.Services;

public interface ISystemNotificationService
{
    Task NotifyWorkOrderAssigned(int workOrderId, int assignedToUserId, string workOrderTitle);
    Task NotifyWorkOrderStatusChanged(int workOrderId, string workOrderTitle, WorkOrderStatus newStatus, int createdByUserId);
    Task NotifyComplaintAssigned(int complaintId, int assignedToUserId, string complaintTitle);
    Task NotifyLowInventory(int inventoryId, string inventoryName, int currentStock, int minimumStock);
    Task NotifyAssetMaintenanceDue(int assetId, string assetName, DateTime dueDate, int? assignedToUserId);
    
    event Func<Message, Task>? OnNotificationCreated;
}

public class SystemNotificationService : ISystemNotificationService
{
    private readonly IApplicationDbContext _context;
    public event Func<Message, Task>? OnNotificationCreated;

    public SystemNotificationService(IApplicationDbContext context)
    {
        _context = context;
    }

    private async Task RaiseNotificationEvent(Message message)
    {
        if (OnNotificationCreated != null)
        {
            await OnNotificationCreated(message);
        }
    }

    public async Task NotifyWorkOrderAssigned(int workOrderId, int assignedToUserId, string workOrderTitle)
    {
        var message = new Message
        {
            Subject = "Work Order Assigned",
            Content = $"Work order '{workOrderTitle}' (#{workOrderId}) has been assigned to you.",
            MessageType = MessageType.System,
            SenderId = 1, // System user ID (could be a constant)
            ReceiverId = assignedToUserId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);
        await RaiseNotificationEvent(message);
    }

    public async Task NotifyWorkOrderStatusChanged(int workOrderId, string workOrderTitle, WorkOrderStatus newStatus, int createdByUserId)
    {
        var message = new Message
        {
            Subject = "Work Order Status Updated",
            Content = $"Work order '{workOrderTitle}' (#{workOrderId}) status changed to {newStatus}.",
            MessageType = MessageType.System,
            SenderId = 1, // System user ID
            ReceiverId = createdByUserId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);
        await RaiseNotificationEvent(message);
    }

    public async Task NotifyComplaintAssigned(int complaintId, int assignedToUserId, string complaintTitle)
    {
        var message = new Message
        {
            Subject = "Complaint Assigned",
            Content = $"Complaint '{complaintTitle}' (#{complaintId}) has been assigned to you for resolution.",
            MessageType = MessageType.System,
            SenderId = 1, // System user ID
            ReceiverId = assignedToUserId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);
        await RaiseNotificationEvent(message);
    }

    public async Task NotifyLowInventory(int inventoryId, string inventoryName, int currentStock, int minimumStock)
    {
        // Send to all admins and managers
        var adminManagers = _context.Users
            .Where(u => u.Role == UserRole.Admin || u.Role == UserRole.Manager)
            .Select(u => u.Id)
            .ToList();

        foreach (var userId in adminManagers)
        {
            var message = new Message
            {
                Subject = "Low Inventory Alert",
                Content = $"Inventory item '{inventoryName}' is running low. Current stock: {currentStock}, Minimum: {minimumStock}",
                MessageType = MessageType.System,
                SenderId = 1, // System user ID
                ReceiverId = userId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await RaiseNotificationEvent(message);
        }

        await _context.SaveChangesAsync(CancellationToken.None);
    }

    public async Task NotifyAssetMaintenanceDue(int assetId, string assetName, DateTime dueDate, int? assignedToUserId)
    {
        var daysUntilDue = (dueDate - DateTime.UtcNow).Days;
        var message = new Message
        {
            Subject = "Asset Maintenance Due",
            Content = $"Asset '{assetName}' maintenance is due in {daysUntilDue} days ({dueDate:MMM dd, yyyy}).",
            MessageType = MessageType.System,
            SenderId = 1, // System user ID
            ReceiverId = assignedToUserId ?? 1, // Send to assigned user or admin
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(CancellationToken.None);
        await RaiseNotificationEvent(message);
    }
}
