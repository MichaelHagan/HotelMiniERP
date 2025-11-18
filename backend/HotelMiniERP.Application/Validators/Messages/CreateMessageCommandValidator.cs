using FluentValidation;
using HotelMiniERP.Application.Messages.Commands;

namespace HotelMiniERP.Application.Validators.Messages;

public class CreateMessageCommandValidator : AbstractValidator<CreateMessageCommand>
{
    public CreateMessageCommandValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Message type is required")
            .Must(t => new[] { "Announcement", "Notification", "Message", "Info", "Warning", "Alert" }.Contains(t))
            .WithMessage("Invalid message type");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(300).WithMessage("Title cannot exceed 300 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(5000).WithMessage("Content cannot exceed 5000 characters");

        RuleFor(x => x.SentByUserId)
            .GreaterThan(0).WithMessage("Sender user ID is required");

        RuleFor(x => x.SentToUserId)
            .GreaterThan(0).When(x => x.Type == "Message")
            .WithMessage("Recipient user ID is required for direct messages");
    }
}

