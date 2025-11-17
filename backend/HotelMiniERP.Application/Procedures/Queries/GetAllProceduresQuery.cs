using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Queries;

public class GetAllProceduresQuery : IRequest<List<ProcedureDto>>
{
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
}
