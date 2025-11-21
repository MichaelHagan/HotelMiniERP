using Microsoft.EntityFrameworkCore;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;

namespace HotelMiniERP.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Asset> Assets { get; set; } = null!;
        public DbSet<WorkOrder> WorkOrders { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<WorkerComplaint> WorkerComplaints { get; set; } = null!;
        public DbSet<CustomerComplaint> CustomerComplaints { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Procedure> Procedures { get; set; } = null!;
        public DbSet<Inventory> Inventory { get; set; } = null!;
        public DbSet<Vendor> Vendors { get; set; } = null!;
        public DbSet<StockTransaction> StockTransactions { get; set; } = null!;
        public DbSet<ComplaintImage> ComplaintImages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Asset Configuration
            modelBuilder.Entity<Asset>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AssetName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.AssetCode).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.AssetCode).IsUnique();
                entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Supplier).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PurchasePrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CurrentValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DepreciationRate).HasColumnType("decimal(5,2)");
            });

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.Position).HasMaxLength(100);
                entity.Property(e => e.Address).HasMaxLength(500);
            });

            // WorkOrder Configuration
            modelBuilder.Entity<WorkOrder>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.WorkOrderNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.WorkOrderNumber).IsUnique();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.EstimatedCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ActualCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.VendorCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.WorkType).HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(200);

                // Relationships
                entity.HasOne(w => w.Asset)
                    .WithMany(a => a.WorkOrders)
                    .HasForeignKey(w => w.AssetId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.AssignedToUser)
                    .WithMany(u => u.AssignedWorkOrders)
                    .HasForeignKey(w => w.AssignedToUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.RequestedByUser)
                    .WithMany(u => u.RequestedWorkOrders)
                    .HasForeignKey(w => w.RequestedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.WorkerComplaint)
                    .WithMany(c => c.WorkOrders)
                    .HasForeignKey(w => w.WorkerComplaintId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.CustomerComplaint)
                    .WithMany(c => c.WorkOrders)
                    .HasForeignKey(w => w.CustomerComplaintId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.Vendor)
                    .WithMany(v => v.WorkOrders)
                    .HasForeignKey(w => w.VendorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // WorkerComplaint Configuration
            modelBuilder.Entity<WorkerComplaint>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ComplaintNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.ComplaintNumber).IsUnique();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.Resolution).HasMaxLength(2000);

                // Relationships
                entity.HasOne(c => c.SubmittedByUser)
                    .WithMany(u => u.SubmittedComplaints)
                    .HasForeignKey(c => c.SubmittedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // CustomerComplaint Configuration
            modelBuilder.Entity<CustomerComplaint>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ComplaintNumber).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.ComplaintNumber).IsUnique();
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CustomerEmail).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CustomerPhone).HasMaxLength(20);
                entity.Property(e => e.RoomNumber).HasMaxLength(20);
                entity.Property(e => e.Resolution).HasMaxLength(2000);
            });

            // Message Configuration
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(300);
                entity.Property(e => e.Content).IsRequired();

                // Relationships
                entity.HasOne(m => m.Sender)
                    .WithMany(u => u.SentMessages)
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Receiver)
                    .WithMany(u => u.ReceivedMessages)
                    .HasForeignKey(m => m.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Procedure Configuration
            modelBuilder.Entity<Procedure>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(300);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Version).IsRequired().HasMaxLength(20);
                entity.Property(e => e.ApprovedBy).HasMaxLength(200);
            });

            // Inventory Configuration
            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
                entity.Property(e => e.UnitCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Notes).HasMaxLength(1000);
            });

            // StockTransaction Configuration
            modelBuilder.Entity<StockTransaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).IsRequired();
                entity.Property(e => e.TransactionDate).IsRequired();
                entity.Property(e => e.UnitCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Notes).HasMaxLength(1000);

                // Relationships
                entity.HasOne(st => st.Inventory)
                    .WithMany(i => i.StockTransactions)
                    .HasForeignKey(st => st.InventoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(st => st.Vendor)
                    .WithMany()
                    .HasForeignKey(st => st.VendorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(st => st.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(st => st.CreatedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Vendor Configuration
            modelBuilder.Entity<Vendor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(200);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.ContactPerson).HasMaxLength(100);
                entity.Property(e => e.Services).HasMaxLength(500);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
            });

            // ComplaintImage Configuration
            modelBuilder.Entity<ComplaintImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.PublicId).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FileName).HasMaxLength(255);

                // Relationships
                entity.HasOne(ci => ci.CustomerComplaint)
                    .WithMany(cc => cc.ComplaintImages)
                    .HasForeignKey(ci => ci.CustomerComplaintId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ci => ci.WorkerComplaint)
                    .WithMany(wc => wc.ComplaintImages)
                    .HasForeignKey(ci => ci.WorkerComplaintId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}