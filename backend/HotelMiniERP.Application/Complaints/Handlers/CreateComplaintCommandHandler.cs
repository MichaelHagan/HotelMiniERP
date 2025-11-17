using HotelMiniERP.Application.Complaints.Commands;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Entities;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Complaints.Handlers;

public class CreateComplaintCommandHandler : IRequestHandler<CreateComplaintCommand, ComplaintDto>
{
    private readonly IApplicationDbContext _context;

    public CreateComplaintCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ComplaintDto> Handle(CreateComplaintCommand request, CancellationToken cancellationToken)
    {
        // Generate complaint number
        var prefix = request.Type.ToLower() == "worker" ? "WC" : "CC";
        var date = DateTime.UtcNow;
        var count = request.Type.ToLower() == "worker" 
            ? await _context.WorkerComplaints.CountAsync(cancellationToken) 
            : await _context.CustomerComplaints.CountAsync(cancellationToken);
        var complaintNumber = $"{prefix}-{date:yyyyMMdd}-{(count + 1):D4}";

        if (request.Type.ToLower() == "worker")
        {
            if (!request.SubmittedByUserId.HasValue)
                throw new InvalidOperationException("SubmittedByUserId is required for worker complaints");

            var workerComplaint = new WorkerComplaint
            {
                ComplaintNumber = complaintNumber,
                Title = request.Title,
                Description = request.Description,
                Status = ComplaintStatus.Open,
                Priority = request.Priority,
                Category = request.Category,
                Location = request.Location,
                SubmittedByUserId = request.SubmittedByUserId.Value,
                AssignedToUserId = request.AssignedToUserId,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.WorkerComplaints.Add(workerComplaint);
            await _context.SaveChangesAsync(cancellationToken);

            return new ComplaintDto
            {
                Id = workerComplaint.Id,
                Type = "worker",
                ComplaintNumber = workerComplaint.ComplaintNumber,
                Title = workerComplaint.Title,
                Description = workerComplaint.Description,
                Status = workerComplaint.Status,
                Priority = workerComplaint.Priority,
                Category = workerComplaint.Category,
                Location = workerComplaint.Location,
                SubmittedByUserId = workerComplaint.SubmittedByUserId,
                AssignedToUserId = workerComplaint.AssignedToUserId,
                ResolvedDate = workerComplaint.ResolvedDate,
                Resolution = workerComplaint.Resolution,
                Notes = workerComplaint.Notes,
                CreatedAt = workerComplaint.CreatedAt,
                UpdatedAt = workerComplaint.UpdatedAt
            };
        }
        else
        {
            if (string.IsNullOrEmpty(request.CustomerName) || string.IsNullOrEmpty(request.CustomerEmail))
                throw new InvalidOperationException("CustomerName and CustomerEmail are required for customer complaints");

            var customerComplaint = new CustomerComplaint
            {
                ComplaintNumber = complaintNumber,
                Title = request.Title,
                Description = request.Description,
                Status = ComplaintStatus.Open,
                Priority = request.Priority,
                Category = request.Category,
                Location = request.Location,
                CustomerName = request.CustomerName,
                CustomerEmail = request.CustomerEmail,
                CustomerPhone = request.CustomerPhone,
                RoomNumber = request.RoomNumber,
                AssignedToUserId = request.AssignedToUserId,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CustomerComplaints.Add(customerComplaint);
            await _context.SaveChangesAsync(cancellationToken);

            return new ComplaintDto
            {
                Id = customerComplaint.Id,
                Type = "customer",
                ComplaintNumber = customerComplaint.ComplaintNumber,
                Title = customerComplaint.Title,
                Description = customerComplaint.Description,
                Status = customerComplaint.Status,
                Priority = customerComplaint.Priority,
                Category = customerComplaint.Category,
                Location = customerComplaint.Location,
                CustomerName = customerComplaint.CustomerName,
                CustomerEmail = customerComplaint.CustomerEmail,
                CustomerPhone = customerComplaint.CustomerPhone,
                RoomNumber = customerComplaint.RoomNumber,
                AssignedToUserId = customerComplaint.AssignedToUserId,
                ResolvedDate = customerComplaint.ResolvedDate,
                Resolution = customerComplaint.Resolution,
                Notes = customerComplaint.Notes,
                CreatedAt = customerComplaint.CreatedAt,
                UpdatedAt = customerComplaint.UpdatedAt
            };
        }
    }
}
