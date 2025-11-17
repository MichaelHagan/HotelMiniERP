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
        [FromQuery] bool? isRead = null)
    {
        try
        {
            var query = new GetAllMessagesQuery
            {
                Type = type,
                SentByUserId = sentByUserId,
                SentToUserId = sentToUserId,
                IsRead = isRead
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

    [HttpPost]
    public async Task<IActionResult> CreateMessage([FromBody] CreateMessageCommand command)
    {
        try
        {
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
