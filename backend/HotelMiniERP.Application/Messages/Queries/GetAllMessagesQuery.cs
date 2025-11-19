using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Messages.Queries;

public class GetAllMessagesQuery : IRequest<PaginatedResponse<MessageDto>>
{
    public string? Type { get; set; }
    public int? SentByUserId { get; set; }
    public int? SentToUserId { get; set; }
    public bool? IsRead { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
