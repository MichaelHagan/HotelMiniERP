using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class WorkerComplaint : BaseEntity
    {
        public string ComplaintNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ComplaintStatus Status { get; set; }
        public ComplaintPriority Priority { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string? Resolution { get; set; }
        public string? Notes { get; set; }

        // Foreign Keys
        public int SubmittedByUserId { get; set; }
        public int? AssignedToUserId { get; set; }

        // Navigation properties
        public User SubmittedByUser { get; set; } = null!;
        public User? AssignedToUser { get; set; }
        public ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
    }
}