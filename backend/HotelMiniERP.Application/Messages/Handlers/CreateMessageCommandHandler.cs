using HotelMiniERP.Application.Messages.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Services;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Messages.Handlers;

public class CreateMessageCommandHandler : IRequestHandler<CreateMessageCommand, MessageDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ISystemNotificationService _notificationService;

    public CreateMessageCommandHandler(IApplicationDbContext context, ISystemNotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
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
            ReceiverId = messageType == MessageType.Broadcast ? null : request.SentToUserId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        // Trigger real-time notification via SignalR
        if (messageType == MessageType.Broadcast || (messageType == MessageType.Personal && request.SentToUserId.HasValue && request.SentToUserId.Value != request.SentByUserId))
        {
            await _notificationService.RaiseNotificationEvent(message);
        }

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
