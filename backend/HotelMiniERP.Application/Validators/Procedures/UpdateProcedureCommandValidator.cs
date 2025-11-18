using FluentValidation;
using HotelMiniERP.Application.Procedures.Commands;

namespace HotelMiniERP.Application.Validators.Procedures;

public class UpdateProcedureCommandValidator : AbstractValidator<UpdateProcedureCommand>
{
    public UpdateProcedureCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Procedure ID is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(300).WithMessage("Title cannot exceed 300 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");
    }
}

