using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using HotelMiniERP.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace HotelMiniERP.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(Cloudinary cloudinary, ILogger<CloudinaryService> logger)
    {
        _cloudinary = cloudinary;
        _logger = logger;
    }

    public async Task<(string SecureUrl, string PublicId)> UploadImageAsync(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is null or empty");
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                throw new ArgumentException($"Invalid file type: {file.ContentType}. Only JPEG, PNG, GIF, and WebP are allowed.");
            }

            // Validate file size (5MB limit)
            const long maxFileSize = 5 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                throw new ArgumentException($"File size exceeds 5MB limit. Size: {file.Length / 1024.0 / 1024.0:F2}MB");
            }

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "complaint-images"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary upload failed: {Error}", uploadResult.Error.Message);
                throw new Exception($"Image upload failed: {uploadResult.Error.Message}");
            }

            _logger.LogInformation("Successfully uploaded image: {FileName} -> {PublicId}", 
                file.FileName, uploadResult.PublicId);

            return (uploadResult.SecureUrl.ToString(), uploadResult.PublicId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image: {FileName}", file?.FileName);
            throw;
        }
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(publicId))
            {
                _logger.LogWarning("Attempted to delete image with null or empty publicId");
                return false;
            }

            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Result == "ok" || result.Result == "not found")
            {
                _logger.LogInformation("Successfully deleted image with publicId: {PublicId}", publicId);
                return true;
            }

            _logger.LogWarning("Failed to delete image with publicId: {PublicId}. Result: {Result}", 
                publicId, result.Result);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image with publicId: {PublicId}", publicId);
            return false;
        }
    }
}
