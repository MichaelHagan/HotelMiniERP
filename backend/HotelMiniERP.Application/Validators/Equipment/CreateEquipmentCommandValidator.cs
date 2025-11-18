using FluentValidation;
using HotelMiniERP.Application.Equipment.Commands;

namespace HotelMiniERP.Application.Validators.Equipment;

public class CreateEquipmentCommandValidator : AbstractValidator<CreateEquipmentCommand>
{
    public CreateEquipmentCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Equipment name is required")
            .MaximumLength(200).WithMessage("Equipment name cannot exceed 200 characters");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Equipment code is required")
            .MaximumLength(50).WithMessage("Equipment code cannot exceed 50 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

        RuleFor(x => x.UnitCost)
            .GreaterThanOrEqualTo(0).WithMessage("Unit cost cannot be negative");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");

        RuleFor(x => x.Location)
            .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.Location))
            .WithMessage("Location cannot exceed 200 characters");

        RuleFor(x => x.Brand)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Brand))
            .WithMessage("Brand cannot exceed 100 characters");

        RuleFor(x => x.Model)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Model))
            .WithMessage("Model cannot exceed 100 characters");
    }
}

