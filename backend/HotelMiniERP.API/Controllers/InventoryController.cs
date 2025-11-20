using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelMiniERP.Application.Inventory.Queries;
using HotelMiniERP.Application.Inventory.Commands;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/inventory")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public InventoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllInventory(
        [FromQuery] string? category = null,
        [FromQuery] string? location = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllInventoryQuery
            {
                Category = category,
                Location = location,
                Page = page,
                PageSize = pageSize
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving inventory", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInventoryById(int id)
    {
        try
        {
            var query = new GetInventoryByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the inventory", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateInventory([FromBody] CreateInventoryCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetInventoryById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the inventory", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInventory(int id, [FromBody] UpdateInventoryCommand command)
    {
        try
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? ex.Message;
            var stackTrace = ex.InnerException?.StackTrace ?? ex.StackTrace;
            return StatusCode(500, new { message = "An error occurred while updating the inventory", error = innerMessage, details = stackTrace });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteInventory(int id)
    {
        try
        {
            var command = new HotelMiniERP.Application.Inventory.Commands.DeleteInventoryCommand { Id = id };
            var success = await _mediator.Send(command);

            if (!success)
            {
                return NotFound(new { message = "Inventory not found" });
            }

            return Ok(new { message = "Inventory deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the inventory", error = ex.Message });
        }
    }
}
