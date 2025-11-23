using HotelMiniERP.Application.Procedures.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Procedures.Handlers;

public class CreateProcedureCommandHandler : IRequestHandler<CreateProcedureCommand, ProcedureDto>
{
    private readonly IApplicationDbContext _context;

    public CreateProcedureCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProcedureDto> Handle(CreateProcedureCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate title
        var existingTitle = await _context.Procedures
            .AnyAsync(p => p.Title.ToLower() == request.Title.ToLower() && !p.IsDeleted, cancellationToken);

        if (existingTitle)
            throw new InvalidOperationException($"Procedure with title '{request.Title}' already exists");

        var procedure = new HotelMiniERP.Domain.Entities.Procedure
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Content = request.Content,
            Version = request.Version ?? "1.0",
            IsActive = true,
            ReviewDate = request.ReviewDate,
            ApprovedBy = request.ApprovedBy,
            ApprovalDate = request.ApprovalDate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Procedures.Add(procedure);
        await _context.SaveChangesAsync(cancellationToken);

        return new ProcedureDto
        {
            Id = procedure.Id,
            Title = procedure.Title,
            Description = procedure.Description,
            Category = procedure.Category,
            Content = procedure.Content,
            Version = procedure.Version,
            IsActive = procedure.IsActive,
            ReviewDate = procedure.ReviewDate,
            ApprovedBy = procedure.ApprovedBy,
            ApprovalDate = procedure.ApprovalDate,
            CreatedAt = procedure.CreatedAt,
            UpdatedAt = procedure.UpdatedAt
        };
    }
}
