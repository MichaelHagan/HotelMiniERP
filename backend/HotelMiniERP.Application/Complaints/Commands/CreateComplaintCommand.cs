using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace HotelMiniERP.Application.Complaints.Commands;

public class CreateComplaintCommand : IRequest<ComplaintDto>
{
    public string Type { get; set; } = "worker"; // "worker" or "customer"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ComplaintPriority Priority { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Notes { get; set; }
    
    // Worker complaint fields
    public int? SubmittedByUserId { get; set; }
    public int? AssignedToUserId { get; set; }
    
    // Customer complaint fields
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string? RoomNumber { get; set; }
    
    // Image files to upload
    public List<IFormFile> Images { get; set; } = new List<IFormFile>();
}
