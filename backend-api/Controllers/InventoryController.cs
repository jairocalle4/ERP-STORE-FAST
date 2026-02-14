using ErpStore.Application.Interfaces;
using ErpStore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet("kardex/{productId}")]
    public async Task<ActionResult<List<InventoryMovement>>> GetKardex(int productId)
    {
        var kardex = await _inventoryService.GetKardexByProductAsync(productId);
        return Ok(kardex);
    }
}
