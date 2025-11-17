using HotelMiniERP.Application.Messages.Commands;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Messages.Handlers;

public class DeleteMessageCommandHandler : IRequestHandler<DeleteMessageCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteMessageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages
            .FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken);

        if (message == null)
            throw new KeyNotFoundException($"Message with ID {request.Id} not found");

        // Soft delete
        message.IsDeleted = true;
        message.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
