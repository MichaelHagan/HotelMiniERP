using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Inventory.Queries;

public class GetAllInventoryQuery : IRequest<PaginatedResponse<InventoryDto>>
{
    public string? Category { get; set; }
    public string? Location { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
