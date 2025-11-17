using MediatR;
using HotelMiniERP.Application.DTOs;

namespace HotelMiniERP.Application.Queries.Assets
{
    public class GetAllAssetsQuery : IRequest<IEnumerable<AssetDto>>
    {
    }

    public class GetAssetByIdQuery : IRequest<AssetDto?>
    {
        public int Id { get; set; }
    }

    public class GetAssetsByStatusQuery : IRequest<IEnumerable<AssetDto>>
    {
        public Domain.Enums.AssetStatus Status { get; set; }
    }

    public class GetAssetsByCategoryQuery : IRequest<IEnumerable<AssetDto>>
    {
        public string Category { get; set; } = string.Empty;
    }
}