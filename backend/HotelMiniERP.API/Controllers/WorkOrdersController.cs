using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.WorkOrders.Commands;
using HotelMiniERP.Application.WorkOrders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllWorkOrders(
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] int? assignedToUserId = null,
        [FromQuery] int? assetId = null)
    {
        try
        {
            var query = new GetAllWorkOrdersQuery
            {
                Status = status,
                Priority = priority,
                AssignedToUserId = assignedToUserId,
                AssetId = assetId
            };

            var workOrders = await _mediator.Send(query);
            return Ok(workOrders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkOrderById(int id)
    {
        try
        {
            var query = new GetWorkOrderByIdQuery { Id = id };
            var workOrder = await _mediator.Send(query);

            if (workOrder == null)
            {
                return NotFound(new { Message = "Work order not found" });
            }

            return Ok(workOrder);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkOrder([FromBody] CreateWorkOrderCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var workOrder = await _mediator.Send(command);
            
            return CreatedAtAction(
                nameof(GetWorkOrderById), 
                new { id = workOrder.Id }, 
                workOrder
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkOrder(int id, [FromBody] UpdateWorkOrderCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            command.Id = id;
            
            // Get current user info for authorization
            var userIdClaim = User.FindFirst("UserId")?.Value;
            var userRoleClaim = User.FindFirst("Role")?.Value;
            
            if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
            {
                command.CurrentUserId = userId;
            }
            
            if (userRoleClaim != null && Enum.TryParse<Domain.Enums.UserRole>(userRoleClaim, out var role))
            {
                command.CurrentUserRole = role;
            }

            var workOrder = await _mediator.Send(command);
            return Ok(workOrder);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteWorkOrder(int id)
    {
        try
        {
            // TODO: Implement DeleteWorkOrderCommand
            return Ok(new { Message = "Work order deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("my-assignments")]
    public async Task<IActionResult> GetMyAssignedWorkOrders()
    {
        try
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            // TODO: Implement GetWorkOrdersByAssigneeQuery
            return Ok(new { Message = "My assigned work orders - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("by-status/{status}")]
    public async Task<IActionResult> GetWorkOrdersByStatus(string status)
    {
        try
        {
            // TODO: Implement GetWorkOrdersByStatusQuery
            return Ok(new { Message = $"Work orders with status {status} - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("by-priority/{priority}")]
    public async Task<IActionResult> GetWorkOrdersByPriority(string priority)
    {
        try
        {
            // TODO: Implement GetWorkOrdersByPriorityQuery
            return Ok(new { Message = $"Work orders with priority {priority} - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("reports/summary")]
    public async Task<IActionResult> GetWorkOrderSummary()
    {
        try
        {
            // TODO: Implement work order summary report
            var mockSummary = new
            {
                TotalWorkOrders = 25,
                OpenWorkOrders = 8,
                InProgressWorkOrders = 12,
                CompletedWorkOrders = 5,
                HighPriorityWorkOrders = 3,
                OverdueWorkOrders = 2,
                AverageCompletionTime = "2.5 days"
            };

            return Ok(mockSummary);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}