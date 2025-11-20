using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Vendors.Commands;

public class DeleteVendorCommandHandler : IRequestHandler<DeleteVendorCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteVendorCommand request, CancellationToken cancellationToken)
    {
        var vendor = await _context.Vendors
            .FirstOrDefaultAsync(v => v.Id == request.Id, cancellationToken);

        if (vendor == null)
        {
            return false;
        }

        // Soft delete - just mark as inactive
        vendor.IsActive = false;
        vendor.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
