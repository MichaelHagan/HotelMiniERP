using HotelMiniERP.Application.Commands.Auth;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred during login", Error = ex.Message });
        }
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred during registration", Error = ex.Message });
        }
    }

    [HttpPost("refresh")]
    [Authorize]
    public async Task<IActionResult> RefreshToken()
    {
        // TODO: Implement token refresh logic
        return Ok(new { Message = "Token refresh endpoint - to be implemented" });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst("UserId")?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        // TODO: Get user profile via MediatR query
        return Ok(new { Message = "User profile endpoint - to be implemented" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var usernameClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        var emailClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        var fullNameClaim = User.FindFirst("FullName")?.Value;

        if (userIdClaim == null || usernameClaim == null)
        {
            return Unauthorized();
        }

        var names = fullNameClaim?.Split(' ') ?? new[] { "Unknown", "User" };
        
        var user = new UserDto
        {
            Id = int.Parse(userIdClaim),
            Username = usernameClaim,
            Email = emailClaim ?? "admin@hotel.com",
            FirstName = names.Length > 0 ? names[0] : "Unknown",
            LastName = names.Length > 1 ? string.Join(" ", names.Skip(1)) : "User",
            Role = Enum.Parse<Domain.Enums.UserRole>(roleClaim ?? "Admin")
        };

        return Ok(user);
    }
}