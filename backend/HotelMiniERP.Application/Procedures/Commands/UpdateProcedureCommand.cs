using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Commands;

public class UpdateProcedureCommand : IRequest<ProcedureDto>
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Department { get; set; }
    public string? Steps { get; set; }
    public string? Requirements { get; set; }
    public bool? IsActive { get; set; }
}
