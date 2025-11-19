using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Queries;

public class GetAllProceduresQuery : IRequest<PaginatedResponse<ProcedureDto>>
{
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
