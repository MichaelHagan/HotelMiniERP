using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelMiniERP.Application.Equipment.Queries;
using HotelMiniERP.Application.Equipment.Commands;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EquipmentController : ControllerBase
{
    private readonly IMediator _mediator;

    public EquipmentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEquipment(
        [FromQuery] string? category = null,
        [FromQuery] string? status = null,
        [FromQuery] string? location = null)
    {
        try
        {
            var query = new GetAllEquipmentQuery
            {
                Category = category,
                Status = status,
                Location = location
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving equipment", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEquipmentById(int id)
    {
        try
        {
            var query = new GetEquipmentByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the equipment", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateEquipment([FromBody] CreateEquipmentCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetEquipmentById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the equipment", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEquipment(int id, [FromBody] UpdateEquipmentCommand command)
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
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the equipment", error = ex.Message });
        }
    }
}
