using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Equipment.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Equipment.Handlers;

public class CreateEquipmentCommandHandler : IRequestHandler<CreateEquipmentCommand, EquipmentDto>
{
    private readonly IApplicationDbContext _context;

    public CreateEquipmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EquipmentDto> Handle(CreateEquipmentCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate code
        var existingCode = await _context.Equipment
            .AnyAsync(e => e.Code.ToLower() == request.Code.ToLower(), cancellationToken);

        if (existingCode)
        {
            throw new InvalidOperationException($"Equipment code '{request.Code}' already exists.");
        }

        var equipment = new HotelMiniERP.Domain.Entities.Equipment
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            Category = request.Category,
            Brand = request.Brand,
            Model = request.Model,
            SerialNumber = request.SerialNumber,
            UnitCost = request.UnitCost,
            Quantity = request.Quantity,
            Location = request.Location,
            Status = request.Status,
            LastMaintenanceDate = request.LastMaintenanceDate,
            NextMaintenanceDate = request.LastMaintenanceDate?.AddMonths(6),
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Equipment.Add(equipment);
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
