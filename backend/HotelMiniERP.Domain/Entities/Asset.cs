using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class Asset : BaseEntity
    {
        public string AssetName { get; set; } = string.Empty;
        public string AssetCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string Supplier { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public AssetStatus Status { get; set; }
        public DateTime? WarrantyExpiry { get; set; }
        public string? SerialNumber { get; set; }
        public string? Model { get; set; }
        public string? Brand { get; set; }
        public decimal? DepreciationRate { get; set; }
        public decimal? CurrentValue { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
    }
}