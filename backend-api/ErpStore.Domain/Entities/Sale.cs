using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Sale : BaseEntity
{
    public DateTime Date { get; set; }
    public int EmployeeId { get; set; }
    public decimal Total { get; set; }
    public string? Observation { get; set; }
    public int? ClientId { get; set; }
    public string? NoteNumber { get; set; }
    public bool IsVoid { get; set; }
    public string PaymentMethod { get; set; } = "Efectivo";

    // Relationships
    public Employee? Employee { get; set; }
    public Client? Client { get; set; }
    public ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
}
