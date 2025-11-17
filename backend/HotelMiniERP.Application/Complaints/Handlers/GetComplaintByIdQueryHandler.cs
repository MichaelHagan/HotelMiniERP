using HotelMiniERP.Application.Complaints.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class GetComplaintByIdQueryHandler : IRequestHandler<GetComplaintByIdQuery, ComplaintDto>
{
    private readonly IApplicationDbContext _context;

    public GetComplaintByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ComplaintDto> Handle(GetComplaintByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.Type.ToLower() == "worker")
        {
            var workerComplaint = await _context.WorkerComplaints
                .Where(c => c.Id == request.Id)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    Type = "worker",
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    Priority = c.Priority,
                    Category = c.Category,
                    Location = c.Location,
                    SubmittedByUserId = c.SubmittedByUserId,
                    AssignedToUserId = c.AssignedToUserId,
                    ResolvedDate = c.ResolvedDate,
                    Resolution = c.Resolution,
                    Notes = c.Notes,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (workerComplaint == null)
                throw new KeyNotFoundException($"Worker complaint with ID {request.Id} not found");

            return workerComplaint;
        }
        else
        {
            var customerComplaint = await _context.CustomerComplaints
                .Where(c => c.Id == request.Id)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id,
                    Type = "customer",
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    Priority = c.Priority,
                    Category = c.Category,
                    Location = c.Location,
                    CustomerName = c.CustomerName,
                    CustomerEmail = c.CustomerEmail,
                    CustomerPhone = c.CustomerPhone,
                    RoomNumber = c.RoomNumber,
                    AssignedToUserId = c.AssignedToUserId,
                    ResolvedDate = c.ResolvedDate,
                    Resolution = c.Resolution,
                    Notes = c.Notes,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (customerComplaint == null)
                throw new KeyNotFoundException($"Customer complaint with ID {request.Id} not found");

            return customerComplaint;
        }
    }
}
