using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class Message : BaseEntity
    {
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public MessageType MessageType { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
        public string? AttachmentUrl { get; set; }

        // Foreign Keys
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }

        // Navigation properties
        public User Sender { get; set; } = null!;
        public User Receiver { get; set; } = null!;
    }
}