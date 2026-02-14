using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class CashTransaction : BaseEntity
{
    public int CashRegisterSessionId { get; set; }
    public string Type { get; set; } = "Income"; // Income, Expense
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    // Optional References
    public int? ReferenceId { get; set; } // SaleId or ExpenseId
    public string? ReferenceType { get; set; } // "Sale", "Expense", "Manual"

    // Relationship
    public CashRegisterSession? CashRegisterSession { get; set; }
}
