using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Equipment.Queries;
using HotelMiniERP.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Equipment.Handlers;

public class GetEquipmentByIdQueryHandler : IRequestHandler<GetEquipmentByIdQuery, EquipmentDto?>
{
    private readonly IApplicationDbContext _context;

    public GetEquipmentByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EquipmentDto?> Handle(GetEquipmentByIdQuery request, CancellationToken cancellationToken)
    {
        var equipment = await _context.Equipment
            .Where(e => e.Id == request.Id)
            .Select(e => new EquipmentDto
            {
                Id = e.Id,
                Name = e.Name,
                Code = e.Code,
                Description = e.Description,
                Category = e.Category,
                Brand = e.Brand,
                Model = e.Model,
                SerialNumber = e.SerialNumber,
                UnitCost = e.UnitCost ?? 0,
                Quantity = e.Quantity,
                Location = e.Location,
                Status = e.Status,
                LastMaintenanceDate = e.LastMaintenanceDate,
                NextMaintenanceDate = e.NextMaintenanceDate,
                Notes = e.Notes,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return equipment;
    }
}
