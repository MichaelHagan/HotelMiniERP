namespace HotelMiniERP.Domain.Entities;

    public class Vendor
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? ContactPerson { get; set; }
        public string? Services { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
        public virtual ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }