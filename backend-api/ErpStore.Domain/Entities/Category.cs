using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
}
