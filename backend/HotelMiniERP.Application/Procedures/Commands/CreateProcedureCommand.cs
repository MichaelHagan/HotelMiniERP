using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Commands;

public class CreateProcedureCommand : IRequest<ProcedureDto>
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string? Steps { get; set; }
    public string? Requirements { get; set; }
    public int CreatedByUserId { get; set; }
}
