using ErpStore.Application.DTOs;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/expense-categories")]
public class ExpenseCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseCategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<ExpenseCategoryDto>>> GetCategories([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.ExpenseCategories.Where(c => c.IsActive);

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ExpenseCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsActive = c.IsActive
            })
            .ToListAsync();

        return new PagedResponse<ExpenseCategoryDto>(
            items,
            totalItems,
            page,
            pageSize,
            (int)Math.Ceiling(totalItems / (double)pageSize)
        );
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseCategoryDto>> CreateCategory(CreateExpenseCategoryDto dto)
    {
        var category = new ExpenseCategory
        {
            Name = dto.Name,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.ExpenseCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, new ExpenseCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.ExpenseCategories.FindAsync(id);
        if (category == null) return NotFound();

        // Soft delete
        category.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
