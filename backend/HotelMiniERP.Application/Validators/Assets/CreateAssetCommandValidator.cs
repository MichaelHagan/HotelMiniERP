using FluentValidation;
using HotelMiniERP.Application.Commands.Assets;

namespace HotelMiniERP.Application.Validators.Assets
{
    public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
    {
        public CreateAssetCommandValidator()
        {
            RuleFor(x => x.Asset.AssetName)
                .NotEmpty().WithMessage("Asset name is required")
                .MaximumLength(200).WithMessage("Asset name cannot exceed 200 characters");

            RuleFor(x => x.Asset.AssetCode)
                .NotEmpty().WithMessage("Asset code is required")
                .MaximumLength(50).WithMessage("Asset code cannot exceed 50 characters");

            RuleFor(x => x.Asset.Description)
                .NotEmpty().WithMessage("Description is required")
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

            RuleFor(x => x.Asset.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

            RuleFor(x => x.Asset.PurchasePrice)
                .GreaterThan(0).WithMessage("Purchase price must be greater than 0");

            RuleFor(x => x.Asset.PurchaseDate)
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Purchase date cannot be in the future");

            RuleFor(x => x.Asset.Supplier)
                .NotEmpty().WithMessage("Supplier is required")
                .MaximumLength(200).WithMessage("Supplier cannot exceed 200 characters");

            RuleFor(x => x.Asset.Location)
                .NotEmpty().WithMessage("Location is required")
                .MaximumLength(200).WithMessage("Location cannot exceed 200 characters");
        }
    }
}