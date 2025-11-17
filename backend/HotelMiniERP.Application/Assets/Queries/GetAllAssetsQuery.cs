using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Assets.Queries;

public class GetAllAssetsQuery : IRequest<List<AssetDto>>
{
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? SearchTerm { get; set; }
}
