using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpStore.Application.DTOs;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalesController(AppDbContext context)
    {
        _context = context;
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
        if (dto.Details == null || !dto.Details.Any())
        {
            return BadRequest("Una venta debe tener al menos un producto.");
        }

        // Generate Note Number: 001-001-XXXXXXX
        var lastSale = await _context.Sales.OrderByDescending(s => s.Id).FirstOrDefaultAsync();
        int nextNum = (lastSale?.Id ?? 0) + 1;
        string noteNumber = $"001-001-{nextNum:D8}";

        var sale = new Sale
        {
            Date = DateTime.UtcNow,
            ClientId = dto.ClientId,
            EmployeeId = dto.EmployeeId,
            Observation = dto.Observation ?? "Venta desde POS",
            NoteNumber = noteNumber,
            IsVoid = false,
            PaymentMethod = dto.PaymentMethod,
            Total = 0
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

        // Return full object with includes
        return await _context.Sales
            .Include(s => s.SaleDetails)
            .ThenInclude(sd => sd.Product)
            .Include(s => s.Client)
            .Include(s => s.Employee)
            .FirstOrDefaultAsync(s => s.Id == sale.Id) ?? sale;
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
                }
            }
        }

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
