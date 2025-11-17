using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Equipment.Queries;

public class GetAllEquipmentQuery : IRequest<List<EquipmentDto>>
{
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? Location { get; set; }
}
