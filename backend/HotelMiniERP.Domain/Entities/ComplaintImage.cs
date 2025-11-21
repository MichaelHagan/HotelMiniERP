using HotelMiniERP.Domain.Common;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class ComplaintImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty; // Cloudinary public ID for deletion
        public string? FileName { get; set; }
        public long? FileSize { get; set; }
        
        // Foreign Keys - supports both complaint types
        public int? CustomerComplaintId { get; set; }
        public int? WorkerComplaintId { get; set; }

        // Navigation properties
        public CustomerComplaint? CustomerComplaint { get; set; }
        public WorkerComplaint? WorkerComplaint { get; set; }
    }
}
