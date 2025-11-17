using MediatR;
using HotelMiniERP.Application.DTOs;

namespace HotelMiniERP.Application.Commands.Assets
{
    public class CreateAssetCommand : IRequest<int>
    {
        public CreateAssetDto Asset { get; set; } = null!;
    }

    public class UpdateAssetCommand : IRequest<bool>
    {
        public UpdateAssetDto Asset { get; set; } = null!;
    }

    public class DeleteAssetCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}