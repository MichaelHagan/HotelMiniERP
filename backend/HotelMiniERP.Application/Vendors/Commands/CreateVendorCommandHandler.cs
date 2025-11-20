using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using MediatR;

namespace HotelMiniERP.Application.Vendors.Commands;

public class CreateVendorCommandHandler : IRequestHandler<CreateVendorCommand, VendorDto>
{
    private readonly IApplicationDbContext _context;

    public CreateVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VendorDto> Handle(CreateVendorCommand request, CancellationToken cancellationToken)
    {
        var vendor = new Vendor
        {
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            Address = request.Address,
            ContactPerson = request.ContactPerson,
            Services = request.Services,
            Notes = request.Notes,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync(cancellationToken);

        return new VendorDto
        {
            Id = vendor.Id,
            Name = vendor.Name,
            PhoneNumber = vendor.PhoneNumber,
            Email = vendor.Email,
            Address = vendor.Address,
            ContactPerson = vendor.ContactPerson,
            Services = vendor.Services,
            Notes = vendor.Notes,
            IsActive = vendor.IsActive,
            CreatedAt = vendor.CreatedAt,
            UpdatedAt = vendor.UpdatedAt
        };
    }
}
