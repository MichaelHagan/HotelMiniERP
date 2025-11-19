using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Users.Commands;

public class UpdateProfileCommand : IRequest<UserDto>
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfilePicture { get; set; }
    public string? Address { get; set; }
}
