using HotelMiniERP.Domain.Common;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class Inventory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string Location { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int? MinimumStock { get; set; }
        public decimal? UnitCost { get; set; }
        public int? VendorId { get; set; }
        public DateTime? LastRestockedDate { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual Vendor? Vendor { get; set; }
    }
}