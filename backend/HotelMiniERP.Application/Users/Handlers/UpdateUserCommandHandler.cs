using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Users.Commands;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Users.Handlers;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHashService _passwordHashService;

    public UpdateUserCommandHandler(IApplicationDbContext context, IPasswordHashService passwordHashService)
    {
        _context = context;
        _passwordHashService = passwordHashService;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.Id }, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException($"User with ID {request.Id} not found.");
        }

        // Check for duplicate username (excluding current user)
        var existingUsername = await _context.Users
            .AnyAsync(u => u.Id != request.Id && u.Username.ToLower() == request.Username.ToLower(), cancellationToken);

        if (existingUsername)
        {
            throw new InvalidOperationException($"Username '{request.Username}' is already taken.");
        }

        // Check for duplicate email (excluding current user)
        var existingEmail = await _context.Users
            .AnyAsync(u => u.Id != request.Id && u.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        if (existingEmail)
        {
            throw new InvalidOperationException($"Email '{request.Email}' is already registered.");
        }

        user.Username = request.Username;
        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.PhoneNumber = request.PhoneNumber;
        user.Role = request.Role;
        user.Department = request.Department;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        // Update password only if provided
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = _passwordHashService.HashPassword(request.Password);
        }

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
