using HotelMiniERP.Application.Messages.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Messages.Handlers;

public class UpdateMessageCommandHandler : IRequestHandler<UpdateMessageCommand, MessageDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateMessageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MessageDto> Handle(UpdateMessageCommand request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages
            .FirstOrDefaultAsync(m => m.Id == request.Id && !m.IsDeleted, cancellationToken);

        if (message == null)
            throw new KeyNotFoundException($"Message with ID {request.Id} not found");

        if (request.IsRead.HasValue)
        {
            message.IsRead = request.IsRead.Value;
            if (request.IsRead.Value)
                message.ReadAt = DateTime.UtcNow;
        }

        message.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return new MessageDto
        {
            Id = message.Id,
            Subject = message.Subject,
            Content = message.Content,
            MessageType = message.MessageType,
            IsRead = message.IsRead,
            ReadAt = message.ReadAt,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            CreatedAt = message.CreatedAt,
            UpdatedAt = message.UpdatedAt
        };
    }
}
