using HotelMiniERP.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace HotelMiniERP.API.DTOs;

public class CreateComplaintRequestDto
{
    public string Type { get; set; } = "worker";
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
    
    // Image files
    public List<IFormFile>? Images { get; set; }
}
