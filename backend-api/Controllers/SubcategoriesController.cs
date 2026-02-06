using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/subcategories")]
public class SubcategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SubcategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategories([FromQuery] int? categoryId)
    {
        var query = _context.Subcategories.AsQueryable();
        
        if (categoryId.HasValue)
        {
            query = query.Where(s => s.CategoryId == categoryId.Value);
        }

        return await query.Where(s => s.IsActive).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Subcategory>> CreateSubcategory(Subcategory subcategory)
    {
        subcategory.CreatedAt = DateTime.UtcNow;
        _context.Subcategories.Add(subcategory);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSubcategories), new { categoryId = subcategory.CategoryId }, subcategory);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubcategory(int id, Subcategory subcategory)
    {
        if (id != subcategory.Id) return BadRequest();

        subcategory.UpdatedAt = DateTime.UtcNow;
        _context.Entry(subcategory).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Subcategories.Any(e => e.Id == id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSubcategory(int id)
    {
        var subcategory = await _context.Subcategories.FindAsync(id);
        if (subcategory == null) return NotFound();

        // Verificar si hay productos asociados antes de eliminar
        if (await _context.Products.AnyAsync(p => p.SubcategoryId == id))
        {
            return BadRequest("No se puede eliminar la subcategoría porque tiene productos asociados.");
        }

        _context.Subcategories.Remove(subcategory);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
