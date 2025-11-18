using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Users.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Users.Handlers;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            return false;
        }

        // Business Rule: Check if user has any work orders assigned or requested
        var hasAssignedWorkOrders = await _context.WorkOrders
            .AnyAsync(w => w.AssignedToUserId == request.Id || w.RequestedByUserId == request.Id, cancellationToken);

        if (hasAssignedWorkOrders)
        {
            throw new InvalidOperationException("Cannot delete user that has associated work orders. Please deactivate the user instead.");
        }

        // Check if user has submitted complaints
        var hasComplaints = await _context.WorkerComplaints
            .AnyAsync(c => c.SubmittedByUserId == request.Id, cancellationToken);

        if (hasComplaints)
        {
            throw new InvalidOperationException("Cannot delete user that has submitted complaints. Please deactivate the user instead.");
        }

        // Check if user has sent or received messages
        var hasMessages = await _context.Messages
            .AnyAsync(m => m.SenderId == request.Id || m.ReceiverId == request.Id, cancellationToken);

        if (hasMessages)
        {
            throw new InvalidOperationException("Cannot delete user that has messages. Please deactivate the user instead.");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

