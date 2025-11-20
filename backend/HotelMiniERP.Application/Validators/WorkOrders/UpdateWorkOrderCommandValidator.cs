using FluentValidation;
using HotelMiniERP.Application.WorkOrders.Commands;

namespace HotelMiniERP.Application.Validators.WorkOrders;

public class UpdateWorkOrderCommandValidator : AbstractValidator<UpdateWorkOrderCommand>
{
    public UpdateWorkOrderCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Work order ID is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");

        RuleFor(x => x.EstimatedCost)
            .GreaterThanOrEqualTo(0).When(x => x.EstimatedCost.HasValue)
            .WithMessage("Estimated cost cannot be negative");

        RuleFor(x => x.ActualCost)
            .GreaterThanOrEqualTo(0).When(x => x.ActualCost.HasValue)
            .WithMessage("Actual cost cannot be negative");

        RuleFor(x => x.VendorCost)
            .GreaterThanOrEqualTo(0).When(x => x.VendorCost.HasValue)
            .WithMessage("Vendor cost cannot be negative");

        RuleFor(x => x.ScheduledDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date).When(x => x.ScheduledDate.HasValue)
            .WithMessage("Scheduled date cannot be in the past");

        RuleFor(x => x.CompletedDate)
            .LessThanOrEqualTo(DateTime.UtcNow).When(x => x.CompletedDate.HasValue)
            .WithMessage("Completed date cannot be in the future");

        RuleFor(x => x.WorkType)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.WorkType))
            .WithMessage("Work type cannot exceed 100 characters");

        RuleFor(x => x.Location)
            .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.Location))
            .WithMessage("Location cannot exceed 200 characters");
    }
}

