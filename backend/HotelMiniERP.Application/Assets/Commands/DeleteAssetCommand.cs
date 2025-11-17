using MediatR;

namespace HotelMiniERP.Application.Assets.Commands;

public class DeleteAssetCommand : IRequest<bool>
{
    public int Id { get; set; }
}
