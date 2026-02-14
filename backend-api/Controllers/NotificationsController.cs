using ErpStore.Application.Interfaces;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public NotificationsController(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Notification>>> GetNotifications()
    {
        await EnsureLowStockNotifications();
        
        return await _context.Notifications
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();
    }

    private async Task EnsureLowStockNotifications()
    {
        // Find products with low stock that don't have an unread notification
        var lowStockProducts = await _context.Products
            .Where(p => p.Stock > 0 && p.Stock <= p.MinStock)
            .ToListAsync();

        if (!lowStockProducts.Any()) return;

        var settings = await _context.CompanySettings.FirstOrDefaultAsync();
        var recipient = settings?.Email ?? settings?.SmtpUser;

        foreach (var product in lowStockProducts)
        {
            var hasUnread = await _context.Notifications
                .AnyAsync(n => n.Link == "/products?stock=low" && n.Message.Contains(product.Name) && !n.IsRead);

            if (!hasUnread)
            {
                _context.Notifications.Add(new Notification
                {
                    Title = "Stock Bajo",
                    Message = $"El producto {product.Name} ha llegado a su nivel mínimo ({product.Stock} restantes).",
                    Type = "Warning",
                    Link = "/products?stock=low",
                    CreatedAt = DateTime.UtcNow
                });

                // Send Email for new notification
                if (settings != null && !string.IsNullOrEmpty(recipient))
                {
                    await _emailService.SendEmailAsync(
                        recipient, 
                        "ALERTA: Stock Bajo - " + product.Name, 
                        $"<h3>Alerta de Inventario</h3><p>El producto <b>{product.Name}</b> ha llegado a su nivel mínimo ({product.MinStock}).</p><p>Stock actual: <b>{product.Stock}</b></p><br/><p>Por favor, revise su inventario.</p>"
                    );
                }
            }
        }

        if (_context.ChangeTracker.HasChanges())
        {
            await _context.SaveChangesAsync();
        }
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        return await _context.Notifications.CountAsync(n => !n.IsRead);
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return NotFound();

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var unread = await _context.Notifications.Where(n => !n.IsRead).ToListAsync();
        foreach (var n in unread) n.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return NotFound();

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
