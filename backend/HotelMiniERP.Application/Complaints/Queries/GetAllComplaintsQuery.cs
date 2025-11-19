using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Complaints.Queries;

public class GetAllComplaintsQuery : IRequest<PaginatedResponse<ComplaintDto>>
{
    public string? Type { get; set; } // "worker" or "customer"
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
    public int? AssignedToUserId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
