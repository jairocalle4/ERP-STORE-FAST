using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpStore.Application.DTOs;
using ErpStore.Application.Interfaces;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IInventoryService _inventoryService;

    public SalesController(AppDbContext context, IEmailService emailService, IInventoryService inventoryService)
    {
        _context = context;
        _emailService = emailService;
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Sale>>> GetSales()
    {
        return await _context.Sales
            .Include(s => s.SaleDetails)
            .ThenInclude(sd => sd.Product)
            .Include(s => s.Client)
            .Include(s => s.Employee)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Sale>> GetSale(int id)
    {
        var sale = await _context.Sales
            .Include(s => s.SaleDetails)
            .ThenInclude(sd => sd.Product)
            .Include(s => s.Client)
            .Include(s => s.Employee)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
        {
            return NotFound();
        }

        return sale;
    }
    [HttpPost]
    public async Task<ActionResult<Sale>> CreateSale(CreateSaleDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (dto.Details == null || !dto.Details.Any())
            {
                return BadRequest("Una venta debe tener al menos un producto.");
            }

            // Generate Note Number: 001-001-XXXXXXX
            var lastSale = await _context.Sales.OrderByDescending(s => s.Id).FirstOrDefaultAsync();
            int nextNum = (lastSale?.Id ?? 0) + 1;
            string noteNumber = $"001-001-{nextNum:D8}";

            var userId = GetCurrentUserId(); // Helper method to get current user ID

            // ENFORCE CASH REGISTER SESSION FOR CASH SALES
            int? activeSessionId = null;
            if (dto.PaymentMethod == "Efectivo")
            {
                var session = await _context.CashRegisterSessions
                    .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "Open");

                if (session == null)
                {
                    return BadRequest("NO_OPEN_SESSION: Debe abrir caja antes de realizar ventas en efectivo.");
                }
                activeSessionId = session.Id;
            }

            var sale = new Sale
            {
                Date = DateTime.UtcNow,
                ClientId = dto.ClientId,
                EmployeeId = userId, // Use the current user's ID
                Observation = dto.Observation ?? "Venta desde POS",
                NoteNumber = noteNumber,
                IsVoid = false,
                PaymentMethod = dto.PaymentMethod,
                Total = 0,
                CashRegisterSessionId = activeSessionId // Link to session
            };

            decimal calculatedTotal = 0;

            foreach (var detailDto in dto.Details)
            {
                var product = await _context.Products.FindAsync(detailDto.ProductId);
                if (product == null) continue;

                if (product.Stock < detailDto.Quantity)
                {
                    return BadRequest($"Stock insuficiente para {product.Name}");
                }

                // Update Stock
                product.Stock -= detailDto.Quantity;

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
                            Message = $"El producto {product.Name} ha llegado a su nivel mínimo ({product.Stock} restantes).",
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
                                $"<h3>Alerta de Inventario</h3><p>El producto <b>{product.Name}</b> ha llegado a su nivel mínimo configurado ({product.MinStock}).</p><p>Stock actual: <b>{product.Stock}</b></p><br/><p>Por favor, realice un pedido de reposición pronto.</p>"
                            );
                        }
                    }
                }

                var detail = new SaleDetail
                {
                    ProductId = detailDto.ProductId,
                    Quantity = detailDto.Quantity,
                    UnitPrice = detailDto.UnitPrice,
                    Subtotal = detailDto.Quantity * detailDto.UnitPrice
                };

                calculatedTotal += detail.Subtotal;
                sale.SaleDetails.Add(detail);
            }

            sale.Total = calculatedTotal;

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            // RECORD INVENTORY MOVEMENTS (KARDEX)
            foreach (var detail in sale.SaleDetails)
            {
                await _inventoryService.RegisterMovementAsync(
                    detail.ProductId, 
                    "Venta", 
                    -detail.Quantity, // OUT
                    sale.EmployeeId, 
                    $"Venta #{sale.NoteNumber}", 
                    saleId: sale.Id
                );
            }
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Return full object with includes
            return await _context.Sales
                .Include(s => s.SaleDetails)
                .ThenInclude(sd => sd.Product)
                .Include(s => s.Client)
                .Include(s => s.Employee)
                .FirstOrDefaultAsync(s => s.Id == sale.Id) ?? sale;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id}/void")]
    public async Task<IActionResult> VoidSale(int id)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var sale = await _context.Sales
                .Include(s => s.SaleDetails)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) return NotFound();
            if (sale.IsVoid) return BadRequest("Esta venta ya ha sido anulada.");

            // Restore Stock
            foreach (var detail in sale.SaleDetails)
            {
                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {
                    product.Stock += detail.Quantity;
                }
            }

            sale.IsVoid = true;
            await _context.SaveChangesAsync();

            // RECORD INVENTORY MOVEMENTS (KARDEX)
            foreach (var detail in sale.SaleDetails)
            {
                await _inventoryService.RegisterMovementAsync(
                    detail.ProductId, 
                    "AnulacionVenta", 
                    detail.Quantity, // IN (Restore)
                    GetCurrentUserId(), 
                    $"Anulación Venta #{sale.NoteNumber}", 
                    saleId: sale.Id
                );
            }
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(sale);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Error al anular la venta");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSale(int id)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var sale = await _context.Sales
                .Include(s => s.SaleDetails)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null)
            {
                return NotFound();
            }

            // Restore Stock if it wasn't already voided (to avoid double restoration)
            if (!sale.IsVoid)
            {
                foreach (var detail in sale.SaleDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.Stock += detail.Quantity;
                        
                        // KARDEX
                        await _inventoryService.RegisterMovementAsync(
                            detail.ProductId, 
                            "EliminacionVenta", 
                            detail.Quantity, // IN (Restore)
                            GetCurrentUserId(), 
                            $"Eliminación Venta #{sale.NoteNumber}", 
                            saleId: null // Sale is being deleted
                        );
                    }
                }
            }

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(ex.Message);
        }
    }
    private int GetCurrentUserId()
    {
        var claim = User.FindFirst("id")?.Value;
        if (int.TryParse(claim, out int id)) return id;
        return 0; // Should handle unauthorized better, but [Authorize] handles key part
    }
}
