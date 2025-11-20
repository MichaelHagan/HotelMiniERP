using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Vendors.Commands;

public class UpdateVendorCommand : IRequest<VendorDto>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? ContactPerson { get; set; }
    public string? Services { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}
