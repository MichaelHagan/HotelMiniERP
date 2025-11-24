using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using HotelMiniERP.API.Hubs;
using HotelMiniERP.Application.Messages.Queries;
using HotelMiniERP.Application.Messages.Commands;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IHubContext<MessagingHub> _hubContext;

    public MessagesController(IMediator mediator, IHubContext<MessagingHub> hubContext)
    {
        _mediator = mediator;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages(
        [FromQuery] string? type = null,
        [FromQuery] int? sentByUserId = null,
        [FromQuery] int? sentToUserId = null,
        [FromQuery] bool? isRead = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllMessagesQuery
            {
                Type = type,
                SentByUserId = sentByUserId,
                SentToUserId = sentToUserId,
                IsRead = isRead,
                Page = page,
                PageSize = pageSize
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving messages", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMessageById(int id)
    {
        try
        {
            var query = new GetMessageByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the message", error = ex.Message });
        }
    }

    [HttpGet("unread")]
    public async Task<IActionResult> GetUnreadMessages()
    {
        try
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            // Get personal unread messages
            var personalQuery = new GetAllMessagesQuery
            {
                SentToUserId = userId,
                IsRead = false,
                Page = 1,
                PageSize = 100
            };
            var personalMessages = await _mediator.Send(personalQuery);

            // Get unread broadcast messages
            var broadcastQuery = new GetAllMessagesQuery
            {
                Type = "Broadcast",
                IsRead = false,
                Page = 1,
                PageSize = 100
            };
            var broadcastMessages = await _mediator.Send(broadcastQuery);

            // Combine and return
            var allUnread = personalMessages.Data.Concat(broadcastMessages.Data).Distinct().ToList();
            return Ok(allUnread);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving unread messages", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateMessage([FromBody] CreateMessageCommand command)
    {
        try
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            command.SentByUserId = userId;
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetMessageById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the message", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int id, [FromBody] UpdateMessageCommand command)
    {
        try
        {
            if (id != command.Id)
                return BadRequest(new { message = "ID mismatch" });

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the message", error = ex.Message });
        }
    }

    [HttpPut("{id}/mark-read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        try
        {
            var command = new UpdateMessageCommand
            {
                Id = id,
                IsRead = true
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while marking message as read", error = ex.Message });
        }
    }

    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        try
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            // Get personal unread messages
            var personalQuery = new GetAllMessagesQuery
            {
                SentToUserId = userId,
                IsRead = false,
                Page = 1,
                PageSize = 1000
            };
            var personalMessages = await _mediator.Send(personalQuery);

            // Get unread broadcast messages
            var broadcastQuery = new GetAllMessagesQuery
            {
                Type = "Broadcast",
                IsRead = false,
                Page = 1,
                PageSize = 1000
            };
            var broadcastMessages = await _mediator.Send(broadcastQuery);

            // Combine all unread messages
            var allUnread = personalMessages.Data.Concat(broadcastMessages.Data).Distinct().ToList();

            // Mark each as read
            foreach (var message in allUnread)
            {
                var command = new UpdateMessageCommand
                {
                    Id = message.Id,
                    IsRead = true
                };
                await _mediator.Send(command);
            }

            return Ok(new { message = "All messages marked as read", count = allUnread.Count });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while marking all messages as read", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        try
        {
            var command = new DeleteMessageCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(new { success = result });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the message", error = ex.Message });
        }
    }
}
