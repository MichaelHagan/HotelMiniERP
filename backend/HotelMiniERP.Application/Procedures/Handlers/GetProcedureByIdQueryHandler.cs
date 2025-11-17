using HotelMiniERP.Application.Procedures.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Procedures.Handlers;

public class GetProcedureByIdQueryHandler : IRequestHandler<GetProcedureByIdQuery, ProcedureDto>
{
    private readonly IApplicationDbContext _context;

    public GetProcedureByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProcedureDto> Handle(GetProcedureByIdQuery request, CancellationToken cancellationToken)
    {
        var procedure = await _context.Procedures
            .Where(p => p.Id == request.Id && !p.IsDeleted)
            .Select(p => new ProcedureDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Category = p.Category,
                Content = p.Content,
                Version = p.Version,
                IsActive = p.IsActive,
                ReviewDate = p.ReviewDate,
                ApprovedBy = p.ApprovedBy,
                ApprovalDate = p.ApprovalDate,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (procedure == null)
            throw new KeyNotFoundException($"Procedure with ID {request.Id} not found");

        return procedure;
    }
}
