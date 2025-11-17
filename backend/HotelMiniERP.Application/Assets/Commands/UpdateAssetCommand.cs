using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Assets.Commands;

public class UpdateAssetCommand : IRequest<AssetDto>
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
    public string? Notes { get; set; }
}
