using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Procedures.Queries;
using HotelMiniERP.Application.Procedures.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProceduresController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProceduresController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProcedures(
        [FromQuery] string? category = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllProceduresQuery
            {
                Category = category,
                IsActive = isActive,
                Page = page,
                PageSize = pageSize
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving procedures", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProcedureById(int id)
    {
        try
        {
            var query = new GetProcedureByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the procedure", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProcedure([FromBody] CreateProcedureCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProcedureById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = "An error occurred while creating the procedure", 
                error = ex.Message,
                innerError = ex.InnerException?.Message 
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProcedure(int id, [FromBody] UpdateProcedureCommand command)
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
            return StatusCode(500, new { 
                message = "An error occurred while updating the procedure", 
                error = ex.Message,
                innerError = ex.InnerException?.Message 
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteProcedure(int id)
    {
        try
        {
            var command = new HotelMiniERP.Application.Procedures.Commands.DeleteProcedureCommand { Id = id };
            var success = await _mediator.Send(command);

            if (!success)
            {
                return NotFound(new { message = "Procedure not found" });
            }

            return Ok(new { message = "Procedure deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the procedure", error = ex.Message });
        }
    }
}
