using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Users.Commands;
using MediatR;

namespace HotelMiniERP.Application.Users.Handlers;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHashService _passwordHashService;

    public ChangePasswordCommandHandler(IApplicationDbContext context, IPasswordHashService passwordHashService)
    {
        _context = context;
        _passwordHashService = passwordHashService;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found.");
        }

        // Verify current password
        if (!_passwordHashService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("Current password is incorrect.");
        }

        // Hash and update new password
        user.PasswordHash = _passwordHashService.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
