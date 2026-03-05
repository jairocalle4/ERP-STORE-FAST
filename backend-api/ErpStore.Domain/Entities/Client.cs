using ErpStore.Domain.Common;

namespace ErpStore.Domain.Entities;

public class Client : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? CedulaRuc { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
    public DateTime? RegisteredAt { get; set; }

    /// <summary>
    /// Tipo de identificación para FE: RUC | CEDULA | PASAPORTE | CONSUMIDOR_FINAL.
    /// Si es null, el sistema lo detecta automáticamente por longitud de CedulaRuc.
    /// </summary>
    public string? IdentificationType { get; set; }
}
