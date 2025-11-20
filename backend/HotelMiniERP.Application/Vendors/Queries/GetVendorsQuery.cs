using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Vendors.Queries;

public class GetVendorsQuery : IRequest<List<VendorDto>>
{
    public bool? IsActive { get; set; }
}
