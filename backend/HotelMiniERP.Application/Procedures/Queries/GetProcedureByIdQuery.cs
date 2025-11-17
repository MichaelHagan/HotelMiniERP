using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Queries;

public class GetProcedureByIdQuery : IRequest<ProcedureDto>
{
    public int Id { get; set; }
}
