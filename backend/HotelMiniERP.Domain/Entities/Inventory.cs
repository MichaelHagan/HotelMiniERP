using HotelMiniERP.Domain.Common;
using System;
using System.Collections.Generic;

namespace HotelMiniERP.Domain.Entities
{
    public class Inventory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int? MinimumStock { get; set; }
        public decimal? UnitCost { get; set; }
        public DateTime? LastRestockedDate { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}