using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Users.Queries;

public class GetAllUsersQuery : IRequest<List<UserDto>>
{
    public string? Role { get; set; }
    public string? Department { get; set; }
    public bool? IsActive { get; set; }
    public string? SearchTerm { get; set; }
}
