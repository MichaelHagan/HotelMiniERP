using FluentValidation;
using HotelMiniERP.Application.Complaints.Commands;

namespace HotelMiniERP.Application.Validators.Complaints;

public class UpdateComplaintCommandValidator : AbstractValidator<UpdateComplaintCommand>
{
    public UpdateComplaintCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Complaint ID is required");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Complaint type is required")
            .Must(t => t.ToLower() == "worker" || t.ToLower() == "customer")
            .WithMessage("Complaint type must be 'worker' or 'customer'");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");
    }
}

