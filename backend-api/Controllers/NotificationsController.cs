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
        // Disparar procesamiento de stock bajo (consolidado en el servicio)
        await _emailService.ProcessLowStockAlertsAsync();
        
        return await _context.Notifications
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();
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

    [HttpDelete("all")]
    public async Task<IActionResult> DeleteAll()
    {
        var all = await _context.Notifications.ToListAsync();
        _context.Notifications.RemoveRange(all);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail()
    {
        var settings = await _context.CompanySettings.FirstOrDefaultAsync();

        if (settings == null)
            return BadRequest(new { error = "No hay configuración de empresa guardada." });

        if (string.IsNullOrEmpty(settings.SmtpServer) && string.IsNullOrEmpty(settings.BrevoApiKey))
            return BadRequest(new { error = "No hay método de envío configurado (SMTP o Brevo)." });

        var recipient = settings.Email ?? settings.SmtpUser;

        try
        {
            await _emailService.SendEmailAsync(
                recipient,
                "✅ Prueba de Correo - FASTSTORE ERP",
                $"<h2>¡Correo de prueba exitoso!</h2><p>Este correo fue enviado desde <strong>FASTSTORE ERP</strong>.</p><p style='color:green;font-weight:bold'>✅ La configuración funciona correctamente.</p>"
            );
            return Ok(new { message = $"Correo de prueba enviado a: {recipient}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = $"Error al enviar: {ex.Message}", detail = ex.InnerException?.Message });
        }
    }
}
