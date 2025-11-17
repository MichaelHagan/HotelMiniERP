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
        // Check for duplicate code
        var existingCode = await _context.Procedures
            .AnyAsync(p => p.Title.ToLower() == request.Code.ToLower() && !p.IsDeleted, cancellationToken);

        if (existingCode)
            throw new InvalidOperationException($"Procedure with code '{request.Code}' already exists");

        var procedure = new HotelMiniERP.Domain.Entities.Procedure
        {
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Content = $"Department: {request.Department}\n\nSteps: {request.Steps}\n\nRequirements: {request.Requirements}",
            Version = "1.0",
            IsActive = true,
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
