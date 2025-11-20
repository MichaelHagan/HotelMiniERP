using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using HotelMiniERP.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Ensure database is created
        await context.Database.MigrateAsync();

        // Check if data already exists
        if (await context.Users.AnyAsync())
        {
            return; // Database has been seeded
        }

        var passwordHashService = new PasswordHashService();

        // Seed Users
        var admin = new User
        {
            Username = "admin",
            Email = "admin@hotel.com",
            PasswordHash = passwordHashService.HashPassword("Admin@123"),
            FirstName = "System",
            LastName = "Administrator",
            PhoneNumber = "+1234567890",
            Role = UserRole.Admin,
            Department = "IT",
            Position = "System Administrator",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            HireDate = DateTime.UtcNow.AddYears(-2)
        };

        var manager = new User
        {
            Username = "manager",
            Email = "manager@hotel.com",
            PasswordHash = passwordHashService.HashPassword("Manager@123"),
            FirstName = "John",
            LastName = "Smith",
            PhoneNumber = "+1234567891",
            Role = UserRole.Manager,
            Department = "Operations",
            Position = "Operations Manager",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            HireDate = DateTime.UtcNow.AddYears(-1)
        };

        var worker1 = new User
        {
            Username = "worker1",
            Email = "worker1@hotel.com",
            PasswordHash = passwordHashService.HashPassword("Worker@123"),
            FirstName = "Alice",
            LastName = "Johnson",
            PhoneNumber = "+1234567892",
            Role = UserRole.Worker,
            Department = "Maintenance",
            Position = "Maintenance Technician",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            HireDate = DateTime.UtcNow.AddMonths(-6)
        };

        var worker2 = new User
        {
            Username = "worker2",
            Email = "worker2@hotel.com",
            PasswordHash = passwordHashService.HashPassword("Worker@123"),
            FirstName = "Bob",
            LastName = "Williams",
            PhoneNumber = "+1234567893",
            Role = UserRole.Worker,
            Department = "Housekeeping",
            Position = "Housekeeping Staff",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            HireDate = DateTime.UtcNow.AddMonths(-3)
        };

        context.Users.AddRange(admin, manager, worker1, worker2);
        await context.SaveChangesAsync();

        // Seed Assets
        var asset1 = new Asset
        {
            AssetName = "HVAC System - Lobby",
            AssetCode = "HVAC-001",
            Description = "Central air conditioning system for the main lobby area",
            Category = "HVAC",
            Supplier = "Climate Control Inc",
            Location = "Lobby",
            PurchaseDate = DateTime.UtcNow.AddYears(-3),
            PurchasePrice = 15000.00m,
            CurrentValue = 12000.00m,
            DepreciationRate = 20.00m,
            WarrantyExpiry = DateTime.UtcNow.AddYears(2),
            Status = AssetStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var asset2 = new Asset
        {
            AssetName = "Elevator System - Main",
            AssetCode = "ELEV-001",
            Description = "Primary elevator serving all floors",
            Category = "Elevator",
            Supplier = "Elevator Solutions Ltd",
            Location = "Main Building",
            PurchaseDate = DateTime.UtcNow.AddYears(-5),
            PurchasePrice = 50000.00m,
            CurrentValue = 35000.00m,
            DepreciationRate = 15.00m,
            WarrantyExpiry = DateTime.UtcNow.AddMonths(6),
            Status = AssetStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var asset3 = new Asset
        {
            AssetName = "Water Heater - Floor 3",
            AssetCode = "WHT-003",
            Description = "Electric water heater for third floor rooms",
            Category = "Plumbing",
            Supplier = "Aqua Systems",
            Location = "Floor 3 - Utility Room",
            PurchaseDate = DateTime.UtcNow.AddYears(-2),
            PurchasePrice = 2500.00m,
            CurrentValue = 1800.00m,
            DepreciationRate = 25.00m,
            WarrantyExpiry = DateTime.UtcNow.AddYears(1),
            Status = AssetStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        context.Assets.AddRange(asset1, asset2, asset3);
        await context.SaveChangesAsync();

        // Seed Inventory
        var inventory1 = new Inventory
        {
            Name = "Vacuum Cleaner - Industrial",
            Code = "VAC-001",
            Description = "Heavy-duty vacuum cleaner for carpets",
            Category = "Cleaning",
            Brand = "CleanPro",
            Model = "CP-5000",
            UnitCost = 500.00m,
            Location = "Housekeeping Storage",
            Quantity = 5,
            MinimumStock = 2,
            VendorId = null, // Will be linked to vendor later
            LastRestockedDate = DateTime.UtcNow.AddMonths(-1),
            CreatedAt = DateTime.UtcNow
        };

        var inventory2 = new Inventory
        {
            Name = "Toolset - Maintenance",
            Code = "TOOL-001",
            Description = "Complete toolset for general maintenance",
            Category = "Tools",
            Brand = "ToolMaster",
            Model = "TM-Professional",
            UnitCost = 1200.00m,
            Location = "Maintenance Room",
            Quantity = 3,
            MinimumStock = 1,
            VendorId = null, // Will be linked to vendor later
            LastRestockedDate = DateTime.UtcNow.AddMonths(-2),
            CreatedAt = DateTime.UtcNow
        };

        context.Inventory.AddRange(inventory1, inventory2);
        await context.SaveChangesAsync();

        // Seed Sample Procedures
        var procedure1 = new Procedure
        {
            Title = "Daily HVAC System Check",
            Category = "Maintenance",
            Description = "Daily inspection and maintenance procedure for HVAC systems",
            Version = "1.0",
            IsActive = true,
            ReviewDate = DateTime.UtcNow.AddMonths(6),
            CreatedAt = DateTime.UtcNow,
            Content = @"1. Check thermostat settings
2. Inspect air filters for cleanliness
3. Verify proper airflow from vents
4. Listen for unusual noises
5. Record temperature readings
6. Document any issues found"
        };

        var procedure2 = new Procedure
        {
            Title = "Weekly Inventory Inventory",
            Category = "Inventory",
            Description = "Weekly procedure for checking inventory inventory and condition",
            Version = "1.0",
            IsActive = true,
            ReviewDate = DateTime.UtcNow.AddMonths(3),
            CreatedAt = DateTime.UtcNow,
            Content = @"1. Count all inventory items
2. Verify inventory location
3. Check inventory condition
4. Update inventory database
5. Report missing or damaged items"
        };

        context.Procedures.AddRange(procedure1, procedure2);
        await context.SaveChangesAsync();

        Console.WriteLine("Database seeding completed successfully!");
        Console.WriteLine($"Seeded Users: {await context.Users.CountAsync()}");
        Console.WriteLine($"Seeded Assets: {await context.Assets.CountAsync()}");
        Console.WriteLine($"Seeded Inventory: {await context.Inventory.CountAsync()}");
        Console.WriteLine($"Seeded Procedures: {await context.Procedures.CountAsync()}");
    }
}
