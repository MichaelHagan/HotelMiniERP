namespace HotelMiniERP.Domain.Enums
{
    public enum AssetStatus
    {
        Active = 1,
        Inactive = 2,
        UnderMaintenance = 3,
        Disposed = 4
    }

    public enum WorkOrderStatus
    {
        Created = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4
    }

    public enum WorkOrderPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Urgent = 4
    }

    public enum ComplaintStatus
    {
        Open = 1,
        InProgress = 2,
        Resolved = 3,
        Closed = 4
    }

    public enum ComplaintPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    public enum UserRole
    {
        Admin = 1,
        Manager = 2,
        Supervisor = 3,
        Worker = 4
    }

    public enum MessageType
    {
        Info = 1,
        Warning = 2,
        Alert = 3,
        Notification = 4
    }

    public enum InventoryStatus
    {
        Available = 1,
        InUse = 2,
        UnderMaintenance = 3,
        OutOfOrder = 4
    }
}