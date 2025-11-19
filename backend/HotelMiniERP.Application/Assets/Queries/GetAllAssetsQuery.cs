using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Assets.Queries;

public class GetAllAssetsQuery : IRequest<PaginatedResponse<AssetDto>>
{
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
