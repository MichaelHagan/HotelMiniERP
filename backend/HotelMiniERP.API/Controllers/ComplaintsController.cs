using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelMiniERP.Application.Complaints.Queries;
using HotelMiniERP.Application.Complaints.Commands;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComplaintsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ComplaintsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllComplaints(
        [FromQuery] string? type = null,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] string? category = null,
        [FromQuery] int? assignedToUserId = null)
    {
        try
        {
            var query = new GetAllComplaintsQuery
            {
                Type = type,
                Status = status,
                Priority = priority,
                Category = category,
                AssignedToUserId = assignedToUserId
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving complaints", error = ex.Message });
        }
    }

    [HttpGet("{type}/{id}")]
    public async Task<IActionResult> GetComplaintById(string type, int id)
    {
        try
        {
            var query = new GetComplaintByIdQuery { Id = id, Type = type };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the complaint", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateComplaint([FromBody] CreateComplaintCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetComplaintById), new { type = result.Type, id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the complaint", error = ex.Message });
        }
    }

    [HttpPut("{type}/{id}")]
    public async Task<IActionResult> UpdateComplaint(string type, int id, [FromBody] UpdateComplaintCommand command)
    {
        try
        {
            if (id != command.Id || type.ToLower() != command.Type.ToLower())
                return BadRequest(new { message = "ID or type mismatch" });

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the complaint", error = ex.Message });
        }
    }

    [HttpDelete("{type}/{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteComplaint(string type, int id)
    {
        try
        {
            var command = new HotelMiniERP.Application.Complaints.Commands.DeleteComplaintCommand { Id = id, Type = type };
            var success = await _mediator.Send(command);

            if (!success)
            {
                return NotFound(new { message = "Complaint not found" });
            }

            return Ok(new { message = "Complaint deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the complaint", error = ex.Message });
        }
    }
}
