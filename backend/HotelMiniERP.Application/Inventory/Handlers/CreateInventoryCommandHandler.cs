using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Inventory.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Inventory.Handlers;

public class CreateInventoryCommandHandler : IRequestHandler<CreateInventoryCommand, InventoryDto>
{
    private readonly IApplicationDbContext _context;

    public CreateInventoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryDto> Handle(CreateInventoryCommand request, CancellationToken cancellationToken)
    {
        var inventory = new HotelMiniERP.Domain.Entities.Inventory
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Location = request.Location ?? string.Empty,
            Quantity = 0, // Initial quantity is 0, updated via stock transactions
            MinimumStock = request.MinimumStock,
            UnitCost = request.UnitCost,
            LastRestockedDate = null,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Inventory.Add(inventory);
        await _context.SaveChangesAsync(cancellationToken);

        return new InventoryDto
        {
            Id = inventory.Id,
            Name = inventory.Name,
            Description = inventory.Description,
            Category = inventory.Category,
            Location = inventory.Location,
            Quantity = inventory.Quantity,
            MinimumStock = inventory.MinimumStock,
            UnitCost = inventory.UnitCost,
            LastRestockedDate = inventory.LastRestockedDate,
            Notes = inventory.Notes,
            CreatedAt = inventory.CreatedAt,
            UpdatedAt = inventory.UpdatedAt
        };
    }
}
