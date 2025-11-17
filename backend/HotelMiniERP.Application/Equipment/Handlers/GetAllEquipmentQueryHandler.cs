using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Equipment.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Equipment.Handlers;

public class GetAllEquipmentQueryHandler : IRequestHandler<GetAllEquipmentQuery, List<EquipmentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllEquipmentQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EquipmentDto>> Handle(GetAllEquipmentQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Equipment.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(e => e.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<EquipmentStatus>(request.Status, out var status))
        {
            query = query.Where(e => e.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            query = query.Where(e => e.Location == request.Location);
        }

        var equipment = await query
            .OrderBy(e => e.Name)
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
            .ToListAsync(cancellationToken);

        return equipment;
    }
}
