using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Equipment.Commands;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Equipment.Handlers;

public class UpdateEquipmentCommandHandler : IRequestHandler<UpdateEquipmentCommand, EquipmentDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateEquipmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EquipmentDto> Handle(UpdateEquipmentCommand request, CancellationToken cancellationToken)
    {
        var equipment = await _context.Equipment.FindAsync(new object[] { request.Id }, cancellationToken);

        if (equipment == null)
        {
            throw new InvalidOperationException($"Equipment with ID {request.Id} not found.");
        }

        // Check for duplicate code (excluding current equipment)
        var existingCode = await _context.Equipment
            .AnyAsync(e => e.Id != request.Id && e.Code.ToLower() == request.Code.ToLower(), cancellationToken);

        if (existingCode)
        {
            throw new InvalidOperationException($"Equipment code '{request.Code}' already exists.");
        }

        equipment.Name = request.Name;
        equipment.Code = request.Code;
        equipment.Description = request.Description;
        equipment.Category = request.Category;
        equipment.Brand = request.Brand;
        equipment.Model = request.Model;
        equipment.SerialNumber = request.SerialNumber;
        equipment.UnitCost = request.UnitCost;
        equipment.Quantity = request.Quantity;
        equipment.Location = request.Location;
        equipment.Status = request.Status;
        equipment.Notes = request.Notes;
        equipment.UpdatedAt = DateTime.UtcNow;

        // Update maintenance tracking
        if (request.LastMaintenanceDate.HasValue && request.LastMaintenanceDate != equipment.LastMaintenanceDate)
        {
            equipment.LastMaintenanceDate = request.LastMaintenanceDate;
            equipment.NextMaintenanceDate = request.LastMaintenanceDate.Value.AddMonths(6);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new EquipmentDto
        {
            Id = equipment.Id,
            Name = equipment.Name,
            Code = equipment.Code,
            Description = equipment.Description,
            Category = equipment.Category,
            Brand = equipment.Brand,
            Model = equipment.Model,
            SerialNumber = equipment.SerialNumber,
            UnitCost = equipment.UnitCost ?? 0,
            Quantity = equipment.Quantity,
            Location = equipment.Location,
            Status = equipment.Status,
            LastMaintenanceDate = equipment.LastMaintenanceDate,
            NextMaintenanceDate = equipment.NextMaintenanceDate,
            Notes = equipment.Notes,
            CreatedAt = equipment.CreatedAt,
            UpdatedAt = equipment.UpdatedAt
        };
    }
}
