using HotelMiniERP.Application.Reports.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Reports.Queries;

public class GetInventoryUtilizationReportQuery : IRequest<InventoryUtilizationReportDto>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

