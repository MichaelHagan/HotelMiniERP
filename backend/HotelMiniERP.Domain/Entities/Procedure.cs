using HotelMiniERP.Domain.Common;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class Procedure : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Tags { get; set; }
        public string Version { get; set; } = "1.0";
        public bool IsActive { get; set; } = true;
        public DateTime? ReviewDate { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string? DocumentUrl { get; set; }
        public int? EstimatedDurationMinutes { get; set; }
        public string? RequiredEquipment { get; set; }
        public string? SafetyNotes { get; set; }
    }
}