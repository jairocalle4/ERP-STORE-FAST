using ErpStore.Domain.Common;

using System.ComponentModel.DataAnnotations.Schema;

namespace ErpStore.Domain.Entities;

[Table("Productos")]
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Cost { get; set; } // For ERP only
    public int Stock { get; set; }
    public int MinStock { get; set; } = 3; // Default minimum stock level
    public string SKU { get; set; } = string.Empty;
    public string? Barcode { get; set; } // Codigo de barras
    public bool IsActive { get; set; } = true;
    // public string? ImageUrl { get; set; } // Removed in favor of ProductImages table
    public string? VideoUrl { get; set; }
    public int CategoryId { get; set; }
    public int? SubcategoryId { get; set; }
    
    // Navigation properties
    public Category? Category { get; set; }
    public Subcategory? Subcategory { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
