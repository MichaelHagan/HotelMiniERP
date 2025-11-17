using HotelMiniERP.Domain.Enums;

namespace HotelMiniERP.Application.DTOs;

public class ComplaintDto
{
    public int Id { get; set; }
    public string Type { get; set; } = "worker"; // "worker" or "customer"
    public string ComplaintNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ComplaintStatus Status { get; set; }
    public ComplaintPriority Priority { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string? Resolution { get; set; }
    public string? Notes { get; set; }
    
    // Worker complaint fields
    public int? SubmittedByUserId { get; set; }
    
    // Common fields
    public int? AssignedToUserId { get; set; }
    
    // Customer complaint fields
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string? RoomNumber { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

