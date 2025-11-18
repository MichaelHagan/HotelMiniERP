using MediatR;

namespace HotelMiniERP.Application.Complaints.Commands;

public class DeleteComplaintCommand : IRequest<bool>
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty; // "worker" or "customer"
}

