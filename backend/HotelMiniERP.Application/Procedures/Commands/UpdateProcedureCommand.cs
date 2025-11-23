using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Procedures.Commands;

public class UpdateProcedureCommand : IRequest<ProcedureDto>
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
    public string? Version { get; set; }
    public DateTime? ReviewDate { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovalDate { get; set; }
}
