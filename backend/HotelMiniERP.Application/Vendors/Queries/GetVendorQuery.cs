using HotelMiniERP.Application.DTOs;
using MediatR;

namespace HotelMiniERP.Application.Vendors.Queries;

public class GetVendorQuery : IRequest<VendorDto?>
{
    public int Id { get; set; }
}
