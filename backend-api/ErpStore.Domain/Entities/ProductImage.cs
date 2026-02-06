using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

[Table("ProductoImagenes")]
public class ProductImage
{
    [Key]
    public int Id { get; set; }

    [Column("IdProducto")]
    public int ProductId { get; set; }

    [Column("UrlImagen")]
    public string Url { get; set; } = string.Empty;

    [Column("EsPortada")]
    public bool IsCover { get; set; }

    [Column("Orden")]
    public int Order { get; set; }

    [ForeignKey("ProductId")]
    public Product? Product { get; set; }
}
