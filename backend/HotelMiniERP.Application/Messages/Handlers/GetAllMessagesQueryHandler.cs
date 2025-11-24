using HotelMiniERP.Application.Messages.Queries;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Messages.Handlers;

public class GetAllMessagesQueryHandler : IRequestHandler<GetAllMessagesQuery, PaginatedResponse<MessageDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllMessagesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<MessageDto>> Handle(GetAllMessagesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Messages
            .Where(m => !m.IsDeleted); // Soft delete filter

        if (!string.IsNullOrEmpty(request.Type) && Enum.TryParse<MessageType>(request.Type, true, out var messageType))
            query = query.Where(m => m.MessageType == messageType);

        if (request.SentByUserId.HasValue)
            query = query.Where(m => m.SenderId == request.SentByUserId.Value);

        if (request.SentToUserId.HasValue)
            query = query.Where(m => m.ReceiverId.HasValue && m.ReceiverId.Value == request.SentToUserId.Value);

        if (request.IsRead.HasValue)
            query = query.Where(m => m.IsRead == request.IsRead.Value);

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        var messages = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<MessageDto>
        {
            Data = messages,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
