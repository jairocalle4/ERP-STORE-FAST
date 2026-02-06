using ErpStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/media")]
public class MediaController : ControllerBase
{
    private readonly ICloudinaryService _cloudinaryService;

    public MediaController(ICloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No se proporcionó ningún archivo");

        using var stream = file.OpenReadStream();
        var url = await _cloudinaryService.UploadImageAsync(stream, file.FileName);

        if (string.IsNullOrEmpty(url)) return StatusCode(500, "Error al subir imagen a Cloudinary");

        return Ok(new { url });
    }

    [HttpPost("upload-video")]
    public async Task<IActionResult> UploadVideo(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No se proporcionó ningún archivo");

        using var stream = file.OpenReadStream();
        var url = await _cloudinaryService.UploadVideoAsync(stream, file.FileName);

        if (string.IsNullOrEmpty(url)) return StatusCode(500, "Error al subir video a Cloudinary");

        return Ok(new { url });
    }
}
