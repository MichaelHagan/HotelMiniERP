using HotelMiniERP.Application.Reports.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Reports.Queries;

public class GetAssetDepreciationReportQuery : IRequest<AssetDepreciationReportDto>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

