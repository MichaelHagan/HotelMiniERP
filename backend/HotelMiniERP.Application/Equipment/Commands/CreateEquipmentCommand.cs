using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Equipment.Commands;

public class CreateEquipmentCommand : IRequest<EquipmentDto>
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public decimal UnitCost { get; set; }
    public int Quantity { get; set; }
    public string? Location { get; set; }
    public EquipmentStatus Status { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public string? Notes { get; set; }
}
