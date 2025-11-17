using HotelMiniERP.Application.Commands.Auth;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Handlers.Auth;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginCommandHandler(
        IApplicationDbContext context,
        IPasswordHashService passwordHashService,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHashService = passwordHashService;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Find user by username
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        // Verify password
        if (!_passwordHashService.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User account is inactive");
        }

        // Update last login
        user.LastLogin = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // Create user DTO
        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            PhoneNumber = user.PhoneNumber,
            Department = user.Department,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            LastLogin = user.LastLogin
        };

        // Generate JWT token
        var token = _jwtTokenService.GenerateToken(userDto);

        return new LoginResponseDto
        {
            Token = token,
            User = userDto,
            ExpiresAt = DateTime.UtcNow.AddDays(7).ToString("O")
        };
    }
}
