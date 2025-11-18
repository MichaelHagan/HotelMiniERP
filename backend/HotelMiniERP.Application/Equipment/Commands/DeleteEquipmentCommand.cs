using MediatR;

namespace HotelMiniERP.Application.Equipment.Commands;

public class DeleteEquipmentCommand : IRequest<bool>
{
    public int Id { get; set; }
}

