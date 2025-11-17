using HotelMiniERP.Application.Messages.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Messages.Handlers;

public class CreateMessageCommandHandler : IRequestHandler<CreateMessageCommand, MessageDto>
{
    private readonly IApplicationDbContext _context;

    public CreateMessageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MessageDto> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<MessageType>(request.Type, true, out var messageType))
            throw new InvalidOperationException($"Invalid message type: {request.Type}");

        var message = new Message
        {
            Subject = request.Title,
            Content = request.Content,
            MessageType = messageType,
            SenderId = request.SentByUserId,
            ReceiverId = request.SentToUserId ?? request.SentByUserId, // Default to sender if no receiver
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
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
