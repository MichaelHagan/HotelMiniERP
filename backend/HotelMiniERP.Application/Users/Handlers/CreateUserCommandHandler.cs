using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Users.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Users.Handlers;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHashService _passwordHashService;

    public CreateUserCommandHandler(IApplicationDbContext context, IPasswordHashService passwordHashService)
    {
        _context = context;
        _passwordHashService = passwordHashService;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate username
        var existingUsername = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);

        if (existingUsername)
        {
            throw new InvalidOperationException($"Username '{request.Username}' is already taken.");
        }

        // Check for duplicate email
        var existingEmail = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        if (existingEmail)
        {
            throw new InvalidOperationException($"Email '{request.Email}' is already registered.");
        }

        // Hash password
        var hashedPassword = _passwordHashService.HashPassword(request.Password);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = hashedPassword,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            Department = request.Department,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
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
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            Department = user.Department,
            IsActive = user.IsActive,
            LastLogin = user.LastLogin,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
