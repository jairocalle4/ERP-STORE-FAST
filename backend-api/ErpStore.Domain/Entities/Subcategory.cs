using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Subcategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Category? Category { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
