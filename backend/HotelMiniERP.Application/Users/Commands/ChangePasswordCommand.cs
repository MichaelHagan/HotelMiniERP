using MediatR;

namespace HotelMiniERP.Application.Users.Commands;

public class ChangePasswordCommand : IRequest<bool>
{
    public int UserId { get; set; }
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
