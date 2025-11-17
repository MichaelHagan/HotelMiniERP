using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Complaints.Queries;

public class GetComplaintByIdQuery : IRequest<ComplaintDto>
{
    public int Id { get; set; }
    public string Type { get; set; } = "worker"; // "worker" or "customer"
}
