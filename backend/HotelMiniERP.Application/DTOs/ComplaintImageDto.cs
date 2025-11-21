namespace HotelMiniERP.Application.DTOs;

public class ComplaintImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
    public DateTime CreatedAt { get; set; }
}
