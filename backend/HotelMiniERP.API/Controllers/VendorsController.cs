using HotelMiniERP.Application.Vendors.Commands;
using HotelMiniERP.Application.Vendors.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public VendorsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetVendors([FromQuery] bool? isActive = null)
    {
        try
        {
            var query = new GetVendorsQuery { IsActive = isActive };
            var vendors = await _mediator.Send(query);
            return Ok(vendors);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving vendors", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVendor(int id)
    {
        try
        {
            var query = new GetVendorQuery { Id = id };
            var vendor = await _mediator.Send(query);

            if (vendor == null)
            {
                return NotFound(new { message = $"Vendor with ID {id} not found" });
            }

            return Ok(vendor);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the vendor", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateVendor([FromBody] CreateVendorCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vendor = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetVendor), new { id = vendor.Id }, vendor);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the vendor", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVendor(int id, [FromBody] UpdateVendorCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            command.Id = id;
            var vendor = await _mediator.Send(command);
            return Ok(vendor);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the vendor", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVendor(int id)
    {
        try
        {
            var command = new DeleteVendorCommand { Id = id };
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = $"Vendor with ID {id} not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the vendor", error = ex.Message });
        }
    }
}
