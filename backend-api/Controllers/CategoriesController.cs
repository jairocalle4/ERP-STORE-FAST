using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] bool onlyWithProducts = false)
    {
        if (onlyWithProducts)
        {
            // Get IDs of categories that have at least one active product
            var categoryIdsWithProducts = await _context.Products
                .Where(p => p.IsActive)
                .Select(p => p.CategoryId)
                .Distinct()
                .ToListAsync();

            var filteredCategories = await _context.Categories
                .Include(c => c.Subcategories.Where(s => s.IsActive))
                .Where(c => c.IsActive && categoryIdsWithProducts.Contains(c.Id))
                .ToListAsync();

            return Ok(filteredCategories);
        }

        var allCategories = await _context.Categories
            .Include(c => c.Subcategories.Where(s => s.IsActive))
            .Where(c => c.IsActive)
            .ToListAsync();

        return Ok(allCategories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Subcategories.Where(s => s.IsActive))
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        return category;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        try
        {
            category.CreatedAt = DateTime.UtcNow;
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al crear la categoría: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, Category category)
    {
        if (id != category.Id) return BadRequest("El ID de la categoría no coincide.");

        var existingCategory = await _context.Categories.FindAsync(id);
        if (existingCategory == null) return NotFound();

        existingCategory.Name = category.Name;
        existingCategory.Description = category.Description;
        existingCategory.IsActive = category.IsActive;
        existingCategory.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Categories.Any(e => e.Id == id)) return NotFound();
            else throw;
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al actualizar la categoría: {ex.InnerException?.Message ?? ex.Message}");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .Include(c => c.Subcategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        // Check for dependencies
        if (await _context.Products.AnyAsync(p => p.CategoryId == id))
        {
            return BadRequest("No se puede eliminar la categoría porque tiene productos asociados. Debe eliminarlos o cambiarlos de categoría primero.");
        }

        if (await _context.Subcategories.AnyAsync(s => s.CategoryId == id))
        {
            return BadRequest("No se puede eliminar la categoría porque tiene subcategorías asociadas.");
        }

        try
        {
            // If it has no dependencies, we can do a hard delete or stay with soft delete.
            // But usually "Deletar" means remove.
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException ex)
        {
            // If hard delete fails due to other constraints
            return BadRequest($"Error al eliminar la categoría: {ex.InnerException?.Message ?? ex.Message}");
        }
    }
}
