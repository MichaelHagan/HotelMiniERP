using HotelMiniERP.Application.Messages.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Messages.Handlers;

public class GetMessageByIdQueryHandler : IRequestHandler<GetMessageByIdQuery, MessageDto>
{
    private readonly IApplicationDbContext _context;

    public GetMessageByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MessageDto> Handle(GetMessageByIdQuery request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages
            .Where(m => m.Id == request.Id && !m.IsDeleted) // Soft delete filter
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Subject = m.Subject,
                Content = m.Content,
                MessageType = m.MessageType,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (message == null)
            throw new KeyNotFoundException($"Message with ID {request.Id} not found");

        return message;
    }
}
