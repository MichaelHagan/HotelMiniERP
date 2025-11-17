using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Commands.Auth;

public class LoginCommand : IRequest<LoginResponseDto>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
    public string ExpiresAt { get; set; } = string.Empty;
}
