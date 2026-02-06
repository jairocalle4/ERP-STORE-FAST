using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace ErpStore.Application.Services;

public interface ICloudinaryService
{
    Task<string?> UploadImageAsync(Stream fileStream, string fileName);
    Task<string?> UploadVideoAsync(Stream fileStream, string fileName);
}

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var section = configuration.GetSection("CloudinarySettings");
        var account = new Account(
            section["CloudName"],
            section["ApiKey"],
            section["ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    public async Task<string?> UploadImageAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "erp-store/products",
            UseFilename = true,
            UniqueFilename = true
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult?.SecureUrl?.ToString();
    }

    public async Task<string?> UploadVideoAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new VideoUploadParams()
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "erp-store/videos"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult?.SecureUrl?.ToString();
    }
}
