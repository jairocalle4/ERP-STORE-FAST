using ErpStore.Application.DTOs;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
    {
        var expenses = await _context.Expenses
            .Include(e => e.ExpenseCategory)
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        return expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Description = e.Description,
            Amount = e.Amount,
            ExpenseCategoryId = e.ExpenseCategoryId,
            CategoryName = e.ExpenseCategory?.Name ?? "Sin Categoría",
            Date = e.Date,
            PaymentMethod = e.PaymentMethod,
            Notes = e.Notes
        }).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
    {
        var expense = await _context.Expenses
            .Include(e => e.ExpenseCategory)
            .FirstOrDefaultAsync(e => e.Id == id);
            
        if (expense == null) return NotFound();

        return new ExpenseDto
        {
            Id = expense.Id,
            Description = expense.Description,
            Amount = expense.Amount,
            ExpenseCategoryId = expense.ExpenseCategoryId,
            CategoryName = expense.ExpenseCategory?.Name ?? "Sin Categoría",
            Date = expense.Date,
            PaymentMethod = expense.PaymentMethod,
            Notes = expense.Notes
        };
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(CreateExpenseDto dto)
    {
        var categoryExists = await _context.ExpenseCategories.AnyAsync(c => c.Id == dto.ExpenseCategoryId);
        if (!categoryExists)
        {
            return BadRequest("Categoría inválida.");
        }

        var expense = new Expense
        {
            Description = dto.Description,
            Amount = dto.Amount,
            ExpenseCategoryId = dto.ExpenseCategoryId,
            Date = dto.Date,
            PaymentMethod = dto.PaymentMethod,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(int id, CreateExpenseDto dto)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        var categoryExists = await _context.ExpenseCategories.AnyAsync(c => c.Id == dto.ExpenseCategoryId);
        if (!categoryExists)
        {
            return BadRequest("Categoría inválida.");
        }

        expense.Description = dto.Description;
        expense.Amount = dto.Amount;
        expense.ExpenseCategoryId = dto.ExpenseCategoryId;
        expense.Date = dto.Date;
        expense.PaymentMethod = dto.PaymentMethod;
        expense.Notes = dto.Notes;
        
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
