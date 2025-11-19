using HotelMiniERP.Application.Assets.Queries;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Application.DTOs;
using HotelMiniERP.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelMiniERP.Application.Assets.Handlers;

public class GetAllAssetsQueryHandler : IRequestHandler<GetAllAssetsQuery, PaginatedResponse<AssetDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllAssetsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<AssetDto>> Handle(GetAllAssetsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Assets.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(a => a.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<AssetStatus>(request.Status, out var status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(a =>
                a.AssetName.ToLower().Contains(searchTerm) ||
                a.AssetCode.ToLower().Contains(searchTerm) ||
                a.Description.ToLower().Contains(searchTerm) ||
                a.Location.ToLower().Contains(searchTerm));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        var assets = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetName = a.AssetName,
                AssetCode = a.AssetCode,
                Description = a.Description,
                Category = a.Category,
                PurchasePrice = a.PurchasePrice,
                PurchaseDate = a.PurchaseDate,
                Supplier = a.Supplier,
                Location = a.Location,
                Status = a.Status,
                WarrantyExpiry = a.WarrantyExpiry,
                SerialNumber = a.SerialNumber,
                Model = a.Model,
                Brand = a.Brand,
                DepreciationRate = a.DepreciationRate,
                CurrentValue = a.CurrentValue,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<AssetDto>
        {
            Data = assets,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }
}
