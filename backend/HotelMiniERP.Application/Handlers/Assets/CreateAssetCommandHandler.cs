using MediatR;
using HotelMiniERP.Application.Commands.Assets;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;

namespace HotelMiniERP.Application.Handlers.Assets
{
    public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateAssetCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
        {
            var asset = new Asset
            {
                AssetName = request.Asset.AssetName,
                AssetCode = request.Asset.AssetCode,
                Description = request.Asset.Description,
                Category = request.Asset.Category,
                PurchasePrice = request.Asset.PurchasePrice,
                PurchaseDate = request.Asset.PurchaseDate,
                Supplier = request.Asset.Supplier,
                Location = request.Asset.Location,
                Status = request.Asset.Status,
                WarrantyExpiry = request.Asset.WarrantyExpiry,
                SerialNumber = request.Asset.SerialNumber,
                Model = request.Asset.Model,
                Brand = request.Asset.Brand,
                DepreciationRate = request.Asset.DepreciationRate,
                CurrentValue = request.Asset.PurchasePrice, // Initial current value is purchase price
                Notes = request.Asset.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Note: This is incomplete - need to add to DbSet when we create the Infrastructure layer
            // _context.Assets.Add(asset);
            await _context.SaveChangesAsync(cancellationToken);

            return asset.Id;
        }
    }
}