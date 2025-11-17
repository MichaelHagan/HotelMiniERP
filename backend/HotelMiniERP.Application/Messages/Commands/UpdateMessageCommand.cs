using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Messages.Commands;

public class UpdateMessageCommand : IRequest<MessageDto>
{
    public int Id { get; set; }
    public bool? IsRead { get; set; }
}
