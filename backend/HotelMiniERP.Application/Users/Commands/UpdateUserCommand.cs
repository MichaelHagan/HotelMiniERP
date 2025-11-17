using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Users.Commands;

public class UpdateUserCommand : IRequest<UserDto>
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Password { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; }
    public string? Department { get; set; }
    public bool IsActive { get; set; }
}
