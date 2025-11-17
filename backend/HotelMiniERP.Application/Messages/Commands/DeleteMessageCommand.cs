using MediatR;

namespace HotelMiniERP.Application.Messages.Commands;

public class DeleteMessageCommand : IRequest<bool>
{
    public int Id { get; set; }
}
