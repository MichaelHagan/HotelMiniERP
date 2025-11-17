using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class WorkOrder : BaseEntity
    {
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

        // Foreign Keys
        public int? AssetId { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? RequestedByUserId { get; set; }
        public int? WorkerComplaintId { get; set; }
        public int? CustomerComplaintId { get; set; }

        // Navigation properties
        public Asset? Asset { get; set; }
        public User? AssignedToUser { get; set; }
        public User? RequestedByUser { get; set; }
        public WorkerComplaint? WorkerComplaint { get; set; }
        public CustomerComplaint? CustomerComplaint { get; set; }
    }
}