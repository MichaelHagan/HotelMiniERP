using System;
using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.DTOs
{
    public class AssetDto
    {
        public int Id { get; set; }
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
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateAssetDto
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
        public string? Notes { get; set; }
    }

    public class UpdateAssetDto : CreateAssetDto
    {
        public int Id { get; set; }
        public decimal? CurrentValue { get; set; }
    }
}