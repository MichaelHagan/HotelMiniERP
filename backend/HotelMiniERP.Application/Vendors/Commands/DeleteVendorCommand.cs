using MediatR;

namespace HotelMiniERP.Application.Vendors.Commands;

public class DeleteVendorCommand : IRequest<bool>
{
    public int Id { get; set; }
}
