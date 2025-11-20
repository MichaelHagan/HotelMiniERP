using HotelMiniERP.Application.Auth.Commands;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Auth.Handlers;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHashService _passwordHashService;

    public RegisterCommandHandler(
        IApplicationDbContext context,
        IPasswordHashService passwordHashService)
    {
        _context = context;
        _passwordHashService = passwordHashService;
    }

    public async Task<UserDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if username already exists
        var existingUser = await _context.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);

        if (existingUser)
        {
            throw new InvalidOperationException($"Username '{request.Username}' is already taken");
        }

        // Check if email already exists
        var existingEmail = await _context.Users
            .AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (existingEmail)
        {
            throw new InvalidOperationException($"Email '{request.Email}' is already registered");
        }

        // Hash password
        var passwordHash = _passwordHashService.HashPassword(request.Password);

        // Create new user
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            Department = request.Department,
            Position = request.Position,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            LastLogin = null
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new UserDto
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
    }
}
