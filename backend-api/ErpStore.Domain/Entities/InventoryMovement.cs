using ErpStore.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErpStore.Domain.Entities;

[Table("Kardex")]
public class InventoryMovement : BaseEntity
{
    public int ProductId { get; set; }
    
    // "Venta", "Compra", "Ajuste", "Devolucion", "Anulacion", "InventarioInicial"
    public string Type { get; set; } = string.Empty;
    
    // Positive for IN, Negative for OUT
    public int Quantity { get; set; }
    
    public int StockBefore { get; set; }
    public int StockAfter { get; set; }
    
    public string Reason { get; set; } = string.Empty;
    
    public int UserId { get; set; }
    public User? User { get; set; }
    
    public Product? Product { get; set; }
    
    // Optional links to source documents
    public int? SaleId { get; set; }
    public Sale? Sale { get; set; }
    
    public int? PurchaseId { get; set; }
    public Purchase? Purchase { get; set; }
}
