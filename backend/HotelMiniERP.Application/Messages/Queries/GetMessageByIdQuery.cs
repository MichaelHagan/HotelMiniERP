using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Messages.Queries;

public class GetMessageByIdQuery : IRequest<MessageDto>
{
    public int Id { get; set; }
}
