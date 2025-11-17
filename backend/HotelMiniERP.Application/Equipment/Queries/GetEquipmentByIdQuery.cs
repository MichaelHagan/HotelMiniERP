using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Equipment.Queries;

public class GetEquipmentByIdQuery : IRequest<EquipmentDto?>
{
    public int Id { get; set; }
}
