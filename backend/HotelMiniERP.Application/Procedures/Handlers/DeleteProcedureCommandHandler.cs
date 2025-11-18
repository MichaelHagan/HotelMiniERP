using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Procedures.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Procedures.Handlers;

public class DeleteProcedureCommandHandler : IRequestHandler<DeleteProcedureCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteProcedureCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteProcedureCommand request, CancellationToken cancellationToken)
    {
        var procedure = await _context.Procedures
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (procedure == null)
        {
            return false;
        }

        _context.Procedures.Remove(procedure);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}

