using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Messages.Queries;

public class GetAllMessagesQuery : IRequest<List<MessageDto>>
{
    public string? Type { get; set; }
    public int? SentByUserId { get; set; }
    public int? SentToUserId { get; set; }
    public bool? IsRead { get; set; }
}
