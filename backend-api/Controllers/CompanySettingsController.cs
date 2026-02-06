using ErpStore.Application.DTOs;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class CompanySettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CompanySettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<CompanySetting>> GetSettings()
    {
        var settings = await _context.CompanySettings.FirstOrDefaultAsync();
        
        if (settings == null)
        {
            // Create default settings if none exist
            settings = new CompanySetting
            {
                Name = "Mi Empresa",
                Ruc = "9999999999001",
                Address = "Dirección Principal",
                CurrentSequence = 1,
                CreatedAt = DateTime.UtcNow
            };
            _context.CompanySettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return settings;
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings(CompanySettingDto dto)
    {
        var settings = await _context.CompanySettings.FirstOrDefaultAsync();
        
        if (settings == null)
        {
            settings = new CompanySetting { CreatedAt = DateTime.UtcNow };
            _context.CompanySettings.Add(settings);
        }

        settings.Name = dto.Name;
        settings.Ruc = dto.Ruc;
        settings.Address = dto.Address;
        settings.Phone = dto.Phone;
        settings.Email = dto.Email;
        settings.LegalMessage = dto.LegalMessage;
        settings.SriAuth = dto.SriAuth;
        settings.Establishment = dto.Establishment;
        settings.PointOfIssue = dto.PointOfIssue;
        settings.CurrentSequence = dto.CurrentSequence;
        settings.ExpirationDate = dto.ExpirationDate;
        settings.SocialReason = dto.SocialReason;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(settings);
    }
}
