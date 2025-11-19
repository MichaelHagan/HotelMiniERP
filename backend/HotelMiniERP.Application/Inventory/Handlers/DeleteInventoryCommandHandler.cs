using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class DeleteInventoryCommandHandler : IRequestHandler<DeleteInventoryCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteInventoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteInventoryCommand request, CancellationToken cancellationToken)
    {
        var inventory = await _context.Inventory
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (inventory == null)
        {
            return false;
        }

        _context.Inventory.Remove(inventory);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

