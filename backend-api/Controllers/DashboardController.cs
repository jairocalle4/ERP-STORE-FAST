using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        
        // Only count NON-VOID sales for revenue
        var salesToday = await _context.Sales
            .Where(s => !s.IsVoid && s.Date >= today)
            .SumAsync(s => s.Total);

        var cashToday = await _context.Sales
            .Where(s => !s.IsVoid && s.Date >= today && s.PaymentMethod == "Efectivo")
            .SumAsync(s => s.Total);

        var totalSalesCount = await _context.Sales.CountAsync(s => !s.IsVoid);
        
        // Low stock products
        var lowStockCount = await _context.Products.CountAsync(p => p.Stock > 0 && p.Stock <= p.MinStock);
        var outOfStockCount = await _context.Products.CountAsync(p => p.Stock <= 0);

        // Chart data (last 7 days)
        var last7Days = Enumerable.Range(0, 7).Select(i => today.AddDays(-i)).Reverse().ToList();
        var chartData = new List<object>();

        foreach (var day in last7Days)
        {
            var dayEnd = day.AddDays(1);
            var dailyTotal = await _context.Sales
                .Where(s => !s.IsVoid && s.Date >= day && s.Date < dayEnd)
                .SumAsync(s => s.Total);
            
            chartData.Add(new { name = day.ToString("dd/MM"), ventas = dailyTotal });
        }

        return Ok(new
        {
            salesToday,
            cashToday,
            lowStockCount,
            outOfStockCount,
            chartData
        });
    }
}
