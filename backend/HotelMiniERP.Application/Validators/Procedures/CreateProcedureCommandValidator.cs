using FluentValidation;
using HotelMiniERP.Application.Procedures.Commands;

namespace HotelMiniERP.Application.Validators.Procedures;

public class CreateProcedureCommandValidator : AbstractValidator<CreateProcedureCommand>
{
    public CreateProcedureCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Procedure code is required")
            .MaximumLength(50).WithMessage("Procedure code cannot exceed 50 characters");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(300).WithMessage("Title cannot exceed 300 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Department is required")
            .MaximumLength(100).WithMessage("Department cannot exceed 100 characters");

        RuleFor(x => x.CreatedByUserId)
            .GreaterThan(0).WithMessage("Created by user ID is required");
    }
}

