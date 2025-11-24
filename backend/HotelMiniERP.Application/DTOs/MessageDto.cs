using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.DTOs;

public class MessageDto
{
    public int Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public MessageType MessageType { get; set; }
    public int SenderId { get; set; }
    public int? ReceiverId { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

