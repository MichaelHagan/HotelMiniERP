using HotelMiniERP.Application.Procedures.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Procedures.Handlers;

public class UpdateProcedureCommandHandler : IRequestHandler<UpdateProcedureCommand, ProcedureDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateProcedureCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProcedureDto> Handle(UpdateProcedureCommand request, CancellationToken cancellationToken)
    {
        var procedure = await _context.Procedures
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, cancellationToken);

        if (procedure == null)
            throw new KeyNotFoundException($"Procedure with ID {request.Id} not found");

        // Track if content changed for version increment
        bool contentChanged = false;

        if (!string.IsNullOrEmpty(request.Title))
        {
            procedure.Title = request.Title;
            contentChanged = true;
        }

        if (!string.IsNullOrEmpty(request.Description))
        {
            procedure.Description = request.Description;
            contentChanged = true;
        }

        if (!string.IsNullOrEmpty(request.Category))
        {
            procedure.Category = request.Category;
            contentChanged = true;
        }

        if (!string.IsNullOrEmpty(request.Steps) || !string.IsNullOrEmpty(request.Requirements) || !string.IsNullOrEmpty(request.Department))
        {
            var content = procedure.Content;
            if (!string.IsNullOrEmpty(request.Department))
                content = $"Department: {request.Department}\n\n{content}";
            if (!string.IsNullOrEmpty(request.Steps))
                content += $"\nSteps: {request.Steps}";
            if (!string.IsNullOrEmpty(request.Requirements))
                content += $"\nRequirements: {request.Requirements}";
            
            procedure.Content = content;
            contentChanged = true;
        }

        if (request.IsActive.HasValue)
            procedure.IsActive = request.IsActive.Value;

        // Increment version if content changed
        if (contentChanged)
        {
            var versionParts = procedure.Version.Split('.');
            if (versionParts.Length == 2 && int.TryParse(versionParts[1], out int minorVersion))
            {
                procedure.Version = $"{versionParts[0]}.{minorVersion + 1}";
            }
        }

        procedure.UpdatedAt = DateTime.UtcNow;
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
