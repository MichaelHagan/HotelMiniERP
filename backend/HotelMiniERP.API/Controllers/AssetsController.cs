using HotelMiniERP.Application.Assets.Commands;
using HotelMiniERP.Application.Assets.Queries;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AssetsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAssets(
        [FromQuery] string? category = null, 
        [FromQuery] string? status = null, 
        [FromQuery] string? searchTerm = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllAssetsQuery
            {
                Category = category,
                Status = status,
                SearchTerm = searchTerm,
                Page = page,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssetById(int id)
    {
        try
        {
            var query = new GetAssetByIdQuery { Id = id };
            var asset = await _mediator.Send(query);

            if (asset == null)
            {
                return NotFound(new { Message = "Asset not found" });
            }

            return Ok(asset);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var asset = await _mediator.Send(command);
            
            return CreatedAtAction(
                nameof(GetAssetById), 
                new { id = asset.Id }, 
                asset
            );
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

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> UpdateAsset(int id, [FromBody] UpdateAssetCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            command.Id = id;
            var asset = await _mediator.Send(command);

            return Ok(asset);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        try
        {
            var command = new DeleteAssetCommand { Id = id };
            var success = await _mediator.Send(command);

            if (!success)
            {
                return NotFound(new { Message = "Asset not found" });
            }

            return Ok(new { Message = "Asset deleted successfully" });
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

    [HttpGet("search")]
    public async Task<IActionResult> SearchAssets([FromQuery] string? searchTerm, [FromQuery] string? assetType, [FromQuery] string? status)
    {
        try
        {
            // TODO: Implement SearchAssetsQuery
            return Ok(new { Message = "Search functionality - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("reports/depreciation")]
    public async Task<IActionResult> GetDepreciationReport()
    {
        try
        {
            // TODO: Implement asset depreciation report
            return Ok(new { Message = "Depreciation report - to be implemented" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}