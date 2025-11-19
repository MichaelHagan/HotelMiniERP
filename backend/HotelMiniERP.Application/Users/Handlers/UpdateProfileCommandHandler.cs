using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Users.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Users.Handlers;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException($"User with ID {request.UserId} not found.");
        }

        // Check for duplicate email (excluding current user)
        var existingEmail = await _context.Users
            .AnyAsync(u => u.Id != request.UserId && u.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        if (existingEmail)
        {
            throw new InvalidOperationException($"Email '{request.Email}' is already in use.");
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber ?? string.Empty;
        user.ProfilePicture = request.ProfilePicture;
        user.Address = request.Address;
        user.UpdatedAt = DateTime.UtcNow;

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
            LastLogin = user.LastLogin,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
