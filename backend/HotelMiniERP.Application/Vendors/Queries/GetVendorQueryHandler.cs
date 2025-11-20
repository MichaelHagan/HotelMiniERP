using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Vendors.Queries;

public class GetVendorQueryHandler : IRequestHandler<GetVendorQuery, VendorDto?>
{
    private readonly IApplicationDbContext _context;

    public GetVendorQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VendorDto?> Handle(GetVendorQuery request, CancellationToken cancellationToken)
    {
        var vendor = await _context.Vendors
            .Where(v => v.Id == request.Id)
            .Select(v => new VendorDto
            {
                Id = v.Id,
                Name = v.Name,
                PhoneNumber = v.PhoneNumber,
                Email = v.Email,
                Address = v.Address,
                ContactPerson = v.ContactPerson,
                Services = v.Services,
                Notes = v.Notes,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return vendor;
    }
}
