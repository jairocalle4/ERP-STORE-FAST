using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpStore.Application.Interfaces;
using ErpStore.Application.DTOs;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/purchases")]
public class PurchasesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IInventoryService _inventoryService;

    public PurchasesController(AppDbContext context, IEmailService emailService, IInventoryService inventoryService)
    {
        _context = context;
        _emailService = emailService;
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<Purchase>>> GetPurchases([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Purchases
            .Include(p => p.Supplier)
            .Include(p => p.Details)
            .ThenInclude(d => d.Product)
            .OrderByDescending(p => p.Date);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResponse<Purchase>(items, totalCount, page, pageSize, totalPages);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Purchase>> GetPurchase(int id)
    {
        var purchase = await _context.Purchases
            .Include(p => p.Supplier)
            .Include(p => p.Details)
            .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (purchase == null) return NotFound();
        return purchase;
    }

    [HttpPost]
    public async Task<ActionResult<Purchase>> CreatePurchase(CreatePurchaseDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var purchase = new Purchase
            {
                SupplierId = dto.SupplierId,
                Date = dto.Date,
                InvoiceNumber = dto.InvoiceNumber,
                PaymentMethod = dto.PaymentMethod,
                Status = dto.Status,
                Notes = dto.Notes,
                Total = 0
            };

            decimal calculatedTotal = 0;

            foreach (var detailDto in dto.Details)
            {
                var product = await _context.Products.FindAsync(detailDto.ProductId);
                if (product == null) continue;

                var detail = new PurchaseDetail
                {
                    ProductId = detailDto.ProductId,
                    Quantity = detailDto.Quantity,
                    UnitPrice = detailDto.UnitPrice,
                    Subtotal = detailDto.Quantity * detailDto.UnitPrice
                };

                calculatedTotal += detail.Subtotal;
                purchase.Details.Add(detail);

                // UPDATE STOCK
                product.Stock += detail.Quantity;
                // Optional: Update cost of product based on last purchase
                product.Cost = detail.UnitPrice;
            }

            purchase.Total = calculatedTotal;

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();

            // KARDEX LOGGING
            foreach (var detail in purchase.Details)
            {
                await _inventoryService.RegisterMovementAsync(
                    detail.ProductId, 
                    "Compra", 
                    detail.Quantity, // IN
                    GetCurrentUserId(), 
                    $"Compra #{purchase.InvoiceNumber}", 
                    purchaseId: purchase.Id
                );
            }
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return CreatedAtAction(nameof(GetPurchase), new { id = purchase.Id }, purchase);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id}/void")]
    public async Task<IActionResult> VoidPurchase(int id)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var purchase = await _context.Purchases
                .Include(p => p.Details)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (purchase == null) return NotFound();
            if (purchase.IsVoid) return BadRequest("Esta compra ya ha sido anulada.");

            // REVERSE STOCK
            foreach (var detail in purchase.Details)
            {
                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {
                    product.Stock -= detail.Quantity;

                    // LOW STOCK ALERT
                    if (product.Stock <= product.MinStock)
                    {
                        var today = DateTime.UtcNow.Date;
                        var existingAlert = await _context.Notifications
                            .AnyAsync(n => n.Link == "/products?stock=low" && 
                                           n.Title.Contains(product.Name) && 
                                           n.CreatedAt >= today);

                        if (!existingAlert)
                        {
                            _context.Notifications.Add(new Notification
                            {
                                Title = "Stock Bajo",
                                Message = $"El producto {product.Name} ha bajado de su nivel mínimo al anular una compra ({product.Stock} restantes).",
                                Type = "Warning",
                                Link = "/products?stock=low",
                                CreatedAt = DateTime.UtcNow
                            });

                            // Send Email
                            var settings = await _context.CompanySettings.FirstOrDefaultAsync();
                            var recipient = settings?.Email ?? settings?.SmtpUser;
                            if (settings != null && !string.IsNullOrEmpty(recipient))
                            {
                                await _emailService.SendEmailAsync(
                                    recipient, 
                                    "ALERTA: Stock Bajo - " + product.Name, 
                                    $"<h3>Alerta de Inventario (Anulación de Compra)</h3><p>El producto <b>{product.Name}</b> ha bajado de su nivel mínimo al anular una compra.</p><p>Stock actual: <b>{product.Stock}</b></p><br/><p>Por favor, revise su inventario.</p>"
                                );
                            }
                        }
                    }
                }
            }

            purchase.IsVoid = true;
            await _context.SaveChangesAsync();

            // KARDEX LOGGING
            foreach (var detail in purchase.Details)
            {
                await _inventoryService.RegisterMovementAsync(
                    detail.ProductId,
                    "AnulacionCompra",
                    -detail.Quantity, // OUT
                    GetCurrentUserId(),
                    $"Anulación Factura #{purchase.InvoiceNumber}",
                    purchaseId: purchase.Id
                );
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Compra anulada correctamente", purchase });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePurchase(int id)
    {
        return await VoidPurchase(id);
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst("id")?.Value;
        if (int.TryParse(claim, out int id)) return id;
        return 0; 
    }
}

public class CreatePurchaseDto
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "Efectivo";
    public string Status { get; set; } = "Paid";
    public string? Notes { get; set; }
    public List<CreatePurchaseDetailDto> Details { get; set; } = new List<CreatePurchaseDetailDto>();
}

public class CreatePurchaseDetailDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
