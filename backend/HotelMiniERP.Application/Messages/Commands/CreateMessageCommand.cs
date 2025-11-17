using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Messages.Commands;

public class CreateMessageCommand : IRequest<MessageDto>
{
    public string Type { get; set; } = string.Empty; // "Announcement", "Notification", "Message"
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int SentByUserId { get; set; }
    public int? SentToUserId { get; set; }
}
