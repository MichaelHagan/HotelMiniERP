using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.Complaints.Commands;

public class UpdateComplaintCommand : IRequest<ComplaintDto>
{
    public int Id { get; set; }
    public string Type { get; set; } = "worker"; // "worker" or "customer"
    public string? Title { get; set; }
    public string? Description { get; set; }
    public ComplaintStatus? Status { get; set; }
    public ComplaintPriority? Priority { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? Resolution { get; set; }
    public string? Notes { get; set; }
    
    // Customer complaint fields
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string? RoomNumber { get; set; }
}
