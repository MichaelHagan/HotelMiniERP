using FluentValidation;
using HotelMiniERP.Application.StockTransactions.Commands;
using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.Validators.StockTransactions;

public class CreateStockTransactionCommandValidator : AbstractValidator<CreateStockTransactionCommand>
{
    public CreateStockTransactionCommandValidator()
    {
        RuleFor(x => x.InventoryId)
            .NotEmpty().WithMessage("Inventory ID is required")
            .GreaterThan(0).WithMessage("Inventory ID must be greater than 0");

        RuleFor(x => x.TransactionType)
            .IsInEnum().WithMessage("Invalid transaction type");

        RuleFor(x => x.Quantity)
            .NotEmpty().WithMessage("Quantity is required")
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");

        RuleFor(x => x.TransactionDate)
            .NotEmpty().WithMessage("Transaction date is required")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Transaction date cannot be in the future");

        // Vendor is required for Restock transactions
        RuleFor(x => x.VendorId)
            .NotEmpty().WithMessage("Vendor is required for restock transactions")
            .When(x => x.TransactionType == StockTransactionType.Restock);

        // Reduction reason is required for Reduction transactions
        RuleFor(x => x.ReductionReason)
            .NotEmpty().WithMessage("Reduction reason is required for reduction transactions")
            .IsInEnum().WithMessage("Invalid reduction reason")
            .When(x => x.TransactionType == StockTransactionType.Reduction);

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters");

        RuleFor(x => x.UnitCost)
            .GreaterThan(0).WithMessage("Unit cost must be greater than 0")
            .When(x => x.UnitCost.HasValue);

        RuleFor(x => x.CreatedByUserId)
            .GreaterThan(0).WithMessage("User ID must be greater than 0")
            .When(x => x.CreatedByUserId.HasValue);
    }
}
