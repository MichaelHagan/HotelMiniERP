using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Commands;

public class CreateWorkOrderCommand : IRequest<WorkOrderDto>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public WorkOrderPriority Priority { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public decimal? EstimatedCost { get; set; }
    public string? WorkType { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public int? AssetId { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? RequestedByUserId { get; set; }
    public int? WorkerComplaintId { get; set; }
    public int? CustomerComplaintId { get; set; }
}
