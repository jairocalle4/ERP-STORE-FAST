using System.Net;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using ErpStore.Application.Interfaces;
using ErpStore.Infrastructure.Persistence;

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
        var settings = await _context.CompanySettings.FirstOrDefaultAsync();

        if (settings == null || string.IsNullOrEmpty(settings.SmtpServer) || string.IsNullOrEmpty(settings.SmtpUser))
        {
            Console.WriteLine($"EMAIL SIMULATION ERROR: SMTP not configured in Company Settings. To: {to}, Subject: {subject}");
            return;
        }

        try
        {
            using var client = new SmtpClient(settings.SmtpServer, settings.SmtpPort)
            {
                Credentials = new NetworkCredential(settings.SmtpUser, settings.SmtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(settings.SmtpUser, settings.Name),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);
            Console.WriteLine($"EMAIL SENT: To {to} using database SMTP settings");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"EMAIL ERROR: {ex.Message}");
        }
    }
}
