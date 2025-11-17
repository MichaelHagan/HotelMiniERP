using HotelMiniERP.Application.Complaints.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class GetAllComplaintsQueryHandler : IRequestHandler<GetAllComplaintsQuery, List<ComplaintDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllComplaintsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ComplaintDto>> Handle(GetAllComplaintsQuery request, CancellationToken cancellationToken)
    {
        var complaints = new List<ComplaintDto>();

        // Get worker complaints if type is null or "worker"
        if (string.IsNullOrEmpty(request.Type) || request.Type.ToLower() == "worker")
        {
            var workerQuery = _context.WorkerComplaints.AsQueryable();

            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<ComplaintStatus>(request.Status, true, out var status))
                workerQuery = workerQuery.Where(c => c.Status == status);

            if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<ComplaintPriority>(request.Priority, true, out var priority))
                workerQuery = workerQuery.Where(c => c.Priority == priority);

            if (!string.IsNullOrEmpty(request.Category))
                workerQuery = workerQuery.Where(c => c.Category.ToLower().Contains(request.Category.ToLower()));

            if (request.AssignedToUserId.HasValue)
                workerQuery = workerQuery.Where(c => c.AssignedToUserId == request.AssignedToUserId.Value);

            var workerComplaints = await workerQuery
                .OrderByDescending(c => c.CreatedAt)
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
                .ToListAsync(cancellationToken);

            complaints.AddRange(workerComplaints);
        }

        // Get customer complaints if type is null or "customer"
        if (string.IsNullOrEmpty(request.Type) || request.Type.ToLower() == "customer")
        {
            var customerQuery = _context.CustomerComplaints.AsQueryable();

            if (!string.IsNullOrEmpty(request.Status) && Enum.TryParse<ComplaintStatus>(request.Status, true, out var status))
                customerQuery = customerQuery.Where(c => c.Status == status);

            if (!string.IsNullOrEmpty(request.Priority) && Enum.TryParse<ComplaintPriority>(request.Priority, true, out var priority))
                customerQuery = customerQuery.Where(c => c.Priority == priority);

            if (!string.IsNullOrEmpty(request.Category))
                customerQuery = customerQuery.Where(c => c.Category.ToLower().Contains(request.Category.ToLower()));

            if (request.AssignedToUserId.HasValue)
                customerQuery = customerQuery.Where(c => c.AssignedToUserId == request.AssignedToUserId.Value);

            var customerComplaints = await customerQuery
                .OrderByDescending(c => c.CreatedAt)
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
                .ToListAsync(cancellationToken);

            complaints.AddRange(customerComplaints);
        }

        return complaints.OrderByDescending(c => c.CreatedAt).ToList();
    }
}
