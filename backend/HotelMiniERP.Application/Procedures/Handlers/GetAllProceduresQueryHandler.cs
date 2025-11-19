using HotelMiniERP.Application.Procedures.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Procedures.Handlers;

public class GetAllProceduresQueryHandler : IRequestHandler<GetAllProceduresQuery, PaginatedResponse<ProcedureDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllProceduresQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<ProcedureDto>> Handle(GetAllProceduresQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Procedures
            .Where(p => !p.IsDeleted);

        if (!string.IsNullOrEmpty(request.Category))
            query = query.Where(p => p.Category.ToLower().Contains(request.Category.ToLower()));

        if (request.IsActive.HasValue)
            query = query.Where(p => p.IsActive == request.IsActive.Value);

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        var procedures = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<ProcedureDto>
        {
            Data = procedures,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
