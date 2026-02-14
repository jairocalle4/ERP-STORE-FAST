using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Supplier : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? TaxId { get; set; } // RUC / CEDULA
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? ContactName { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}
