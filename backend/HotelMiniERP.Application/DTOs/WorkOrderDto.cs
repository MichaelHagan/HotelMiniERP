using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.DTOs;

public class WorkOrderDto
{
    public int Id { get; set; }
    public string WorkOrderNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public WorkOrderStatus Status { get; set; }
    public WorkOrderPriority Priority { get; set; }
    public DateTime RequestedDate { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? ActualCost { get; set; }
    public string? WorkType { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public int? AssetId { get; set; }
    public string? AssetName { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    public int? RequestedByUserId { get; set; }
    public string? RequestedByUserName { get; set; }
    public int? WorkerComplaintId { get; set; }
    public int? CustomerComplaintId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
