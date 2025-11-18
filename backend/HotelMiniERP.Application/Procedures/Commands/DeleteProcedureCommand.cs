using MediatR;

namespace HotelMiniERP.Application.Procedures.Commands;

public class DeleteProcedureCommand : IRequest<bool>
{
    public int Id { get; set; }
}

