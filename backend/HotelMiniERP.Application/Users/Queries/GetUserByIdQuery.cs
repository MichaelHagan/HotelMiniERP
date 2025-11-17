using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Users.Queries;

public class GetUserByIdQuery : IRequest<UserDto?>
{
    public int Id { get; set; }
}
