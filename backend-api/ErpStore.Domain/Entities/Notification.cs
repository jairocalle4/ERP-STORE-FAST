using ErpStore.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErpStore.Domain.Entities;

[Table("Notificaciones")]
public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info"; // Info, Warning, Success, Error
    public bool IsRead { get; set; } = false;
    public string? Link { get; set; } // Optional: /products?id=123
}
