using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class PurchaseDetail : BaseEntity
{
    public int PurchaseId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }

    // Navigation
    public Purchase? Purchase { get; set; }
    public Product? Product { get; set; }
}
