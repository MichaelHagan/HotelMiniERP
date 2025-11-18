using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Equipment.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Equipment.Handlers;

public class DeleteEquipmentCommandHandler : IRequestHandler<DeleteEquipmentCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteEquipmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteEquipmentCommand request, CancellationToken cancellationToken)
    {
        var equipment = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (equipment == null)
        {
            return false;
        }

        _context.Equipment.Remove(equipment);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

