using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.Complaints.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class DeleteComplaintCommandHandler : IRequestHandler<DeleteComplaintCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteComplaintCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteComplaintCommand request, CancellationToken cancellationToken)
    {
        if (request.Type.ToLower() == "worker")
        {
            var complaint = await _context.WorkerComplaints
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
            {
                return false;
            }

            // Check if complaint has associated work orders
            var hasWorkOrders = await _context.WorkOrders
                .AnyAsync(w => w.WorkerComplaintId == request.Id, cancellationToken);

            if (hasWorkOrders)
            {
                throw new InvalidOperationException("Cannot delete complaint that has associated work orders.");
            }

            _context.WorkerComplaints.Remove(complaint);
        }
        else if (request.Type.ToLower() == "customer")
        {
            var complaint = await _context.CustomerComplaints
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (complaint == null)
            {
                return false;
            }

            // Check if complaint has associated work orders
            var hasWorkOrders = await _context.WorkOrders
                .AnyAsync(w => w.CustomerComplaintId == request.Id, cancellationToken);

            if (hasWorkOrders)
            {
                throw new InvalidOperationException("Cannot delete complaint that has associated work orders.");
            }

            _context.CustomerComplaints.Remove(complaint);
        }
        else
        {
            throw new InvalidOperationException($"Invalid complaint type: {request.Type}. Must be 'worker' or 'customer'.");
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}

