using FluentValidation;
using HotelMiniERP.Application.Complaints.Commands;

namespace HotelMiniERP.Application.Validators.Complaints;

public class CreateComplaintCommandValidator : AbstractValidator<CreateComplaintCommand>
{
    public CreateComplaintCommandValidator()
    {
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

        RuleFor(x => x.Location)
            .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.Location))
            .WithMessage("Location cannot exceed 200 characters");

        // Worker complaint validation
        When(x => x.Type.ToLower() == "worker", () =>
        {
            RuleFor(x => x.SubmittedByUserId)
                .GreaterThan(0).WithMessage("Submitted by user ID is required for worker complaints");
        });

        // Customer complaint validation
        When(x => x.Type.ToLower() == "customer", () =>
        {
            RuleFor(x => x.CustomerName)
                .NotEmpty().WithMessage("Customer name is required for customer complaints")
                .MaximumLength(200).WithMessage("Customer name cannot exceed 200 characters");

            RuleFor(x => x.CustomerEmail)
                .NotEmpty().WithMessage("Customer email is required for customer complaints")
                .EmailAddress().WithMessage("Invalid customer email format")
                .MaximumLength(200).WithMessage("Customer email cannot exceed 200 characters");
        });
    }
}

