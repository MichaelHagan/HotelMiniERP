using HotelMiniERP.Application.DTOs;

namespace HotelMiniERP.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(UserDto user);
        bool ValidateToken(string token);
        int? GetUserIdFromToken(string token);
    }
}