using HotelMiniERP.Application.Assets.Commands;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class DeleteAssetCommandHandler : IRequestHandler<DeleteAssetCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteAssetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (asset == null)
        {
            return false;
        }

        // Check if asset has any work orders
        var hasWorkOrders = await _context.WorkOrders
            .AnyAsync(w => w.AssetId == request.Id, cancellationToken);

        if (hasWorkOrders)
        {
            throw new InvalidOperationException("Cannot delete asset that has associated work orders. Please archive the asset instead.");
        }

        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
