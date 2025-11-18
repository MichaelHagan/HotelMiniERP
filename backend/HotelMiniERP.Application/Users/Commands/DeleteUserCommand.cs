using MediatR;

namespace HotelMiniERP.Application.Users.Commands;

public class DeleteUserCommand : IRequest<bool>
{
    public int Id { get; set; }
}

