using System.Text;
using System.Text.Json;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.EntityFrameworkCore;
using ErpStore.Application.Interfaces;
using ErpStore.Infrastructure.Persistence;
using ErpStore.Domain.Entities;

namespace ErpStore.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly AppDbContext _context;

    public EmailService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var settings = await _context.CompanySettings.AsNoTracking().FirstOrDefaultAsync();

        if (settings == null)
            throw new InvalidOperationException("No hay configuración de empresa guardada.");

        if (!string.IsNullOrEmpty(settings.BrevoApiKey))
        {
            await SendViaBrevoAsync(settings.BrevoApiKey, settings.SmtpUser ?? "noreply@faststore.ec", settings.Name ?? "FASTSTORE ERP", to, subject, body);
            return;
        }

        if (string.IsNullOrEmpty(settings.SmtpServer) || string.IsNullOrEmpty(settings.SmtpUser) || string.IsNullOrEmpty(settings.SmtpPass))
            throw new InvalidOperationException("No hay método de envío configurado (Brevo o SMTP).");

        await SendViaSmtpAsync(settings.SmtpServer, settings.SmtpPort, settings.SmtpUser, settings.SmtpPass, settings.Name ?? "FASTSTORE ERP", to, subject, body);
    }

    public async Task ProcessLowStockAlertsAsync()
    {
        try 
        {
            // 1. Obtener todos los productos con stock bajo o agotado
            var lowStockProducts = await _context.Products
                .Where(p => p.Stock <= p.MinStock)
                .OrderBy(p => p.Name)
                .ToListAsync();

            if (!lowStockProducts.Any()) return;

            var settings = await _context.CompanySettings.FirstOrDefaultAsync();
            if (settings == null) return;

            var recipient = settings.Email ?? settings.SmtpUser;
            if (string.IsNullOrEmpty(recipient)) return;

            // 2. Crear notificaciones en el sistema (campanita) si no existen
            foreach (var p in lowStockProducts)
            {
                var exists = await _context.Notifications
                    .AnyAsync(n => n.Link == "/products?stock=low" && n.Message.Contains(p.Name) && !n.IsRead);

                if (!exists)
                {
                    _context.Notifications.Add(new Notification
                    {
                        Title = "Stock Bajo",
                        Message = $"El producto {p.Name} ha llegado a su nivel mínimo ({p.Stock} restantes).",
                        Type = "Warning",
                        Link = "/products?stock=low",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // 3. Lógica de Resumen Inteligente por Email (Máximo 1 cada 8 horas)
            var now = DateTime.UtcNow;
            if (settings.LastStockAlertDate == null || (now - settings.LastStockAlertDate.Value).TotalHours >= 8)
            {
                var rows = string.Join("", lowStockProducts.Select(p => 
                    $"<tr><td style='padding:12px;border-bottom:1px solid #eee;'>{p.Name}</td><td style='padding:12px;border-bottom:1px solid #eee;color:#e11d48;font-weight:bold;'>{p.Stock}</td><td style='padding:12px;border-bottom:1px solid #eee;color:#64748b;'>{p.MinStock}</td></tr>"));

                var body = $@"
                    <div style='font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);'>
                        <div style='background:#4f46e5;color:white;padding:30px;text-align:center;'>
                            <h2 style='margin:0;font-size:24px;letter-spacing:-0.025em;'>Resumen de Inventario Crítico</h2>
                            <p style='margin:8px 0 0;opacity:0.9;font-size:14px;'>{settings.Name ?? "FASTSTORE ERP"}</p>
                        </div>
                        <div style='padding:30px;background:white;'>
                            <p style='color:#475569;font-size:15px;line-height:1.5;'>Hola, se han detectado <b>{lowStockProducts.Count}</b> productos que requieren reposición inmediata:</p>
                            <table style='width:100%;border-collapse:collapse;margin-top:25px;'>
                                <thead>
                                    <tr style='background:#f8fafc;text-align:left;border-bottom:2px solid #e2e8f0;'>
                                        <th style='padding:12px;font-size:11px;text-transform:uppercase;color:#64748b;font-weight:bold;'>Producto</th>
                                        <th style='padding:12px;font-size:11px;text-transform:uppercase;color:#64748b;font-weight:bold;'>Stock</th>
                                        <th style='padding:12px;font-size:11px;text-transform:uppercase;color:#64748b;font-weight:bold;'>Mínimo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                            <div style='margin-top:35px;text-align:center;'>
                                <a href='http://localhost:5173/products?stock=low' style='background:#4f46e5;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;'>Gestionar en el Sistema</a>
                            </div>
                        </div>
                        <div style='background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;'>
                            Este reporte se genera automáticamente cuando hay cambios en el inventario.<br/>
                            Frecuencia máxima: 1 reporte cada 8 horas.
                        </div>
                    </div>";

                await SendEmailAsync(recipient, $"🔴 REPORTE: {lowStockProducts.Count} productos con stock insuficiente", body);
                
                // Actualizar fecha de último envío
                settings.LastStockAlertDate = now;
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LOW_STOCK_SERVICE] Error: {ex.Message}");
        }
    }

    private static async Task SendViaBrevoAsync(string apiKey, string senderEmail, string senderName, string to, string subject, string body)
    {
        var payload = new { sender = new { name = senderName, email = senderEmail }, to = new[] { new { email = to } }, subject, htmlContent = body };
        using var http = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email") { Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json") };
        request.Headers.Add("api-key", apiKey);
        var response = await http.SendAsync(request);
        if (!response.IsSuccessStatusCode) throw new InvalidOperationException($"Error Brevo: {await response.Content.ReadAsStringAsync()}");
    }

    private static async Task SendViaSmtpAsync(string server, int port, string user, string pass, string senderName, string to, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, user));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using var client = new SmtpClient();
        await client.ConnectAsync(server, port, port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(user, pass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
