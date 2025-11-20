using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Vendors.Queries;

public class GetVendorsQueryHandler : IRequestHandler<GetVendorsQuery, List<VendorDto>>
{
    private readonly IApplicationDbContext _context;

    public GetVendorsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VendorDto>> Handle(GetVendorsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Vendors.AsQueryable();

        if (request.IsActive.HasValue)
        {
            query = query.Where(v => v.IsActive == request.IsActive.Value);
        }

        var vendors = await query
            .OrderBy(v => v.Name)
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
            .ToListAsync(cancellationToken);

        return vendors;
    }
}
