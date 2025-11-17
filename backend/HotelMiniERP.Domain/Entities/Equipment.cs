using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class Equipment : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public EquipmentStatus Status { get; set; }
        public string Location { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int? MinimumStock { get; set; }
        public decimal? UnitCost { get; set; }
        public string? Supplier { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? WarrantyExpiry { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public string? MaintenanceNotes { get; set; }
        public string? Notes { get; set; }
    }
}