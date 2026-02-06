using ErpStore.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace ErpStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly DbSeeder _dbSeeder;
    private readonly IWebHostEnvironment _environment;

    public SeedController(DbSeeder dbSeeder, IWebHostEnvironment environment)
    {
        _dbSeeder = dbSeeder;
        _environment = environment;
    }

    [HttpPost("restore")]
    public async Task<IActionResult> RestoreData()
    {
        // Path to the migration_data.json file.
        // We look for it in the root of the application (where we copied it).
        var filePath = Path.Combine(_environment.ContentRootPath, "migration_data.json");
        
        if (!System.IO.File.Exists(filePath))
        {
            // Fallback to parent directory (dev environment)
            var parentPath = Directory.GetParent(_environment.ContentRootPath)?.FullName;
            if (parentPath != null)
            {
                var fallbackPath = Path.Combine(parentPath, "migration_data.json");
                if (System.IO.File.Exists(fallbackPath))
                {
                    filePath = fallbackPath;
                }
            }
        }

        if (!System.IO.File.Exists(filePath))
        {
             return NotFound($"Migration file not found at {filePath}");
        }

        try
        {
            await _dbSeeder.SeedAsync(filePath);
            return Ok(new { message = "Data restored successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error restoring data", error = ex.Message });
        }
    }
}
