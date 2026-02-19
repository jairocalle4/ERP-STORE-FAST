using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous] // Public for PWA
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] bool includeInactive = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 1000,
        [FromQuery] int? categoryId = null,
        [FromQuery] string? search = null) 
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Subcategory)
            .Include(p => p.Images)
            .AsQueryable();
        
        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrEmpty(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) 
                || (p.Description != null && p.Description.ToLower().Contains(searchLower))
                || (p.SKU != null && p.SKU.ToLower().Contains(searchLower)));
        }

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        return await query
            .OrderByDescending(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Subcategory)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (await _context.Products.AnyAsync(p => p.Name == product.Name))
        {
            return BadRequest("Ya existe un producto con este nombre.");
        }

        if (!string.IsNullOrEmpty(product.Barcode) && await _context.Products.AnyAsync(p => p.Barcode == product.Barcode))
        {
            return BadRequest("Ya existe un producto con este código de barras.");
        }

        // Validate Foreign Keys
        if (!await _context.Categories.AnyAsync(c => c.Id == product.CategoryId))
        {
            return BadRequest($"La categoría con ID {product.CategoryId} no existe.");
        }

        if (product.SubcategoryId == 0) product.SubcategoryId = null;
        if (product.SubcategoryId.HasValue && !await _context.Subcategories.AnyAsync(s => s.Id == product.SubcategoryId))
        {
            return BadRequest($"La subcategoría con ID {product.SubcategoryId} no existe.");
        }

        try 
        {
            product.CreatedAt = DateTime.UtcNow;
            // Clear navigation properties to prevent EF from trying to create them if they were passed
            product.Category = null;
            product.Subcategory = null;
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al guardar el producto: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id) return BadRequest("El ID del producto no coincide.");

        if (await _context.Products.AnyAsync(p => p.Name == product.Name && p.Id != id))
        {
            return BadRequest("Ya existe otro producto con este nombre.");
        }

        if (!string.IsNullOrEmpty(product.Barcode) && await _context.Products.AnyAsync(p => p.Barcode == product.Barcode && p.Id != id))
        {
            return BadRequest("Ya existe otro producto con este código de barras.");
        }

        // Validate Foreign Keys
        if (!await _context.Categories.AnyAsync(c => c.Id == product.CategoryId))
        {
            return BadRequest($"La categoría con ID {product.CategoryId} no existe.");
        }

        if (product.SubcategoryId == 0) product.SubcategoryId = null;
        if (product.SubcategoryId.HasValue && !await _context.Subcategories.AnyAsync(s => s.Id == product.SubcategoryId))
        {
            return BadRequest($"La subcategoría con ID {product.SubcategoryId} no existe.");
        }

        var existingProduct = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (existingProduct == null) return NotFound();

        // Update scalar properties
        _context.Entry(existingProduct).CurrentValues.SetValues(product);
        existingProduct.UpdatedAt = DateTime.UtcNow;

        // Update Images
        // 1. Identify images to delete
        var imagesToDelete = existingProduct.Images
            .Where(ei => !product.Images.Any(pi => pi.Id == ei.Id && pi.Id != 0))
            .ToList();

        foreach (var img in imagesToDelete)
        {
            existingProduct.Images.Remove(img);
        }

        // 2. Identify images to add or update
        foreach (var imgData in product.Images)
        {
            if (imgData.Id == 0)
            {
                // New Image
                var newImg = new ProductImage
                {
                    Url = imgData.Url,
                    IsCover = imgData.IsCover,
                    Order = imgData.Order,
                    ProductId = id 
                };
                existingProduct.Images.Add(newImg);
            }
            else
            {
                // Existing Image - Update properties
                var existingImg = existingProduct.Images.FirstOrDefault(i => i.Id == imgData.Id);
                if (existingImg != null)
                {
                    existingImg.Url = imgData.Url;
                    existingImg.IsCover = imgData.IsCover;
                    existingImg.Order = imgData.Order;
                }
            }
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id)) return NotFound();
            else throw;
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al actualizar el producto: {ex.InnerException?.Message ?? ex.Message}");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        // Validate if product is used in Sales
        if (await _context.SaleDetails.AnyAsync(sd => sd.ProductId == id))
        {
            return BadRequest("No se puede eliminar el producto porque tiene historial de ventas. Puede desactivarlo en su lugar.");
        }

        try 
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"No se puede eliminar el producto: {ex.InnerException?.Message ?? ex.Message}");
        }

        return NoContent();
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}
