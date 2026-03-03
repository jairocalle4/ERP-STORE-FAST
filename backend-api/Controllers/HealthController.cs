using Microsoft.AspNetCore.Mvc;

namespace ErpStore.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new 
        { 
            status = "API ERP-STORE-FAST Online", 
            timestamp = DateTime.UtcNow,
            message = "Uptime check successful"
        });
    }
}
