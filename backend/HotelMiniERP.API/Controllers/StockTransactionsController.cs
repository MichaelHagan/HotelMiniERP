using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.StockTransactions.Commands;
using HotelMiniERP.Application.StockTransactions.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelMiniERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockTransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StockTransactionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new stock transaction (restock or reduction)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<StockTransactionDto>> CreateStockTransaction([FromBody] CreateStockTransactionDto dto)
    {
        var command = new CreateStockTransactionCommand
        {
            InventoryId = dto.InventoryId,
            TransactionType = dto.TransactionType,
            Quantity = dto.Quantity,
            VendorId = dto.VendorId,
            TransactionDate = dto.TransactionDate,
            ReductionReason = dto.ReductionReason,
            Notes = dto.Notes,
            UnitCost = dto.UnitCost,
            CreatedByUserId = null // TODO: Get from authenticated user
        };

        try
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetStockTransactionsByInventoryId), new { inventoryId = result.InventoryId }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get all stock transactions for a specific inventory item
    /// </summary>
    [HttpGet("inventory/{inventoryId}")]
    public async Task<ActionResult<List<StockTransactionDto>>> GetStockTransactionsByInventoryId(int inventoryId)
    {
        var query = new GetStockTransactionsByInventoryIdQuery { InventoryId = inventoryId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
