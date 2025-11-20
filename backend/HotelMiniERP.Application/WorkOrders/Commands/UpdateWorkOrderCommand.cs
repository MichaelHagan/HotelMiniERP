using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;

namespace HotelMiniERP.Application.WorkOrders.Commands;

public class UpdateWorkOrderCommand : IRequest<WorkOrderDto>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public WorkOrderStatus Status { get; set; }
    public WorkOrderPriority Priority { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? ActualCost { get; set; }
    public decimal? VendorCost { get; set; }
    public string? WorkType { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public int? AssetId { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? VendorId { get; set; }
    public int CurrentUserId { get; set; }
    public UserRole CurrentUserRole { get; set; }
}
