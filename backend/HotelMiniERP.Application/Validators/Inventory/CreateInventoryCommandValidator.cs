using FluentValidation;
using HotelMiniERP.Application.Inventory.Commands;

namespace HotelMiniERP.Application.Validators.Inventory;

public class CreateInventoryCommandValidator : AbstractValidator<CreateInventoryCommand>
{
    public CreateInventoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Inventory name is required")
            .MaximumLength(200).WithMessage("Inventory name cannot exceed 200 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

        RuleFor(x => x.UnitCost)
            .GreaterThanOrEqualTo(0).WithMessage("Unit cost cannot be negative");

        RuleFor(x => x.Location)
            .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.Location))
            .WithMessage("Location cannot exceed 200 characters");
    }
}

