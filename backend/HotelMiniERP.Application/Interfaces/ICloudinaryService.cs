using Microsoft.AspNetCore.Http;

namespace HotelMiniERP.Application.Interfaces;

public interface ICloudinaryService
{
    /// <summary>
    /// Uploads an image to Cloudinary from an uploaded file
    /// </summary>
    /// <param name="file">The uploaded file</param>
    /// <returns>A tuple containing the secure URL and public ID of the uploaded image</returns>
    Task<(string SecureUrl, string PublicId)> UploadImageAsync(IFormFile file);

    /// <summary>
    /// Deletes an image from Cloudinary using its public ID
    /// </summary>
    /// <param name="publicId">The public ID of the image to delete</param>
    /// <returns>True if deletion was successful, false otherwise</returns>
    Task<bool> DeleteImageAsync(string publicId);
}
