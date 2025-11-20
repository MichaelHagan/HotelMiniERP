using Microsoft.EntityFrameworkCore;
using HotelMiniERP.Domain.Entities;

namespace HotelMiniERP.Application.Interfaces
{
    public interface IApplicationDbContext
    {        
        DbSet<Asset> Assets { get; set; }
        DbSet<WorkOrder> WorkOrders { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<WorkerComplaint> WorkerComplaints { get; set; }
        DbSet<CustomerComplaint> CustomerComplaints { get; set; }
        DbSet<Message> Messages { get; set; }
        DbSet<Procedure> Procedures { get; set; }
        DbSet<HotelMiniERP.Domain.Entities.Inventory> Inventory { get; set; }
        DbSet<Vendor> Vendors { get; set; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}