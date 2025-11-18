using FluentValidation;
using HotelMiniERP.Application.Assets.Commands;

namespace HotelMiniERP.Application.Validators.Assets;

public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    public CreateAssetCommandValidator()
    {
        RuleFor(x => x.AssetName)
            .NotEmpty().WithMessage("Asset name is required")
            .MaximumLength(200).WithMessage("Asset name cannot exceed 200 characters");

        RuleFor(x => x.AssetCode)
            .NotEmpty().WithMessage("Asset code is required")
            .MaximumLength(50).WithMessage("Asset code cannot exceed 50 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

        RuleFor(x => x.PurchasePrice)
            .GreaterThan(0).WithMessage("Purchase price must be greater than 0");

        RuleFor(x => x.PurchaseDate)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Purchase date cannot be in the future");

        RuleFor(x => x.Supplier)
            .NotEmpty().WithMessage("Supplier is required")
            .MaximumLength(200).WithMessage("Supplier cannot exceed 200 characters");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required")
            .MaximumLength(200).WithMessage("Location cannot exceed 200 characters");

        RuleFor(x => x.DepreciationRate)
            .InclusiveBetween(0, 100).When(x => x.DepreciationRate.HasValue)
            .WithMessage("Depreciation rate must be between 0 and 100");
    }
}

