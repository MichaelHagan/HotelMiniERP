using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.WorkOrders.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.WorkOrders.Handlers;

public class DeleteWorkOrderCommandHandler : IRequestHandler<DeleteWorkOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteWorkOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var workOrder = await _context.WorkOrders
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (workOrder == null)
        {
            return false;
        }

        // Business Rule: Only allow deletion of work orders that are not completed
        // Or we can allow deletion but log it for audit purposes
        // For now, we'll allow deletion of any work order
        
        _context.WorkOrders.Remove(workOrder);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

