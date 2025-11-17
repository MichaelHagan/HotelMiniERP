using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Assets.Queries;

public class GetAssetByIdQuery : IRequest<AssetDto?>
{
    public int Id { get; set; }
}
