using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Expense : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    
    public int ExpenseCategoryId { get; set; }
    public ExpenseCategory? ExpenseCategory { get; set; }
    
    public DateTime Date { get; set; }
    public string PaymentMethod { get; set; } = "Efectivo";
    public string? Notes { get; set; }

    public int? CashRegisterSessionId { get; set; }
    public CashRegisterSession? CashRegisterSession { get; set; }
}
