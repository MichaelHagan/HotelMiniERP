using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Vendors.Commands;

public class UpdateVendorCommandHandler : IRequestHandler<UpdateVendorCommand, VendorDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VendorDto> Handle(UpdateVendorCommand request, CancellationToken cancellationToken)
    {
        var vendor = await _context.Vendors
            .FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken);

        if (vendor == null)
        {
            throw new KeyNotFoundException($"Vendor with ID {request.Id} not found");
        }

        vendor.Name = request.Name;
        vendor.PhoneNumber = request.PhoneNumber;
        vendor.Email = request.Email;
        vendor.Address = request.Address;
        vendor.ContactPerson = request.ContactPerson;
        vendor.Services = request.Services;
        vendor.Notes = request.Notes;
        vendor.IsActive = request.IsActive;
        vendor.UpdatedAt = DateTime.UtcNow;

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
