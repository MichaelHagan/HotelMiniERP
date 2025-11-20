using FluentValidation;

namespace HotelMiniERP.Application.Vendors.Commands;

public class UpdateVendorCommandValidator : AbstractValidator<UpdateVendorCommand>
{
    public UpdateVendorCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Valid vendor ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Vendor name is required")
            .MaximumLength(200).WithMessage("Vendor name cannot exceed 200 characters");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters");

        RuleFor(x => x.Email)
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters")
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email)).WithMessage("Invalid email format");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address cannot exceed 500 characters");

        RuleFor(x => x.ContactPerson)
            .MaximumLength(100).WithMessage("Contact person cannot exceed 100 characters");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters");
    }
}
