using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Purchase : BaseEntity
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Status { get; set; } = "Paid"; // Paid, Pending, PartiallyPaid
    public string PaymentMethod { get; set; } = "Efectivo"; // Efectivo, Transferencia, Credito
    public string? Notes { get; set; }

    // Navigation
    public Supplier? Supplier { get; set; }
    public ICollection<PurchaseDetail> Details { get; set; } = new List<PurchaseDetail>();
}
