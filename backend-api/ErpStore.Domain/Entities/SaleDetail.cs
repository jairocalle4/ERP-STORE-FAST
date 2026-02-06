using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class SaleDetail : BaseEntity
{
    public int SaleId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
    public decimal UnitPrice { get; set; }

    // Relationships
    public Sale? Sale { get; set; }
    public Product? Product { get; set; }
}
