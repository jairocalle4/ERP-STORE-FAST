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
    
    public int? CashRegisterSessionId { get; set; }
    public CashRegisterSession? CashRegisterSession { get; set; }

    // === Facturación Electrónica SRI ===
    /// <summary>Indica si esta venta fue emitida como factura electrónica al SRI.</summary>
    public bool IsElectronic { get; set; } = false;

    /// <summary>Clave de acceso de 49 dígitos generada por el sistema.</summary>
    public string? AccessKey { get; set; }

    /// <summary>Número de autorización devuelto por el SRI (48 dígitos).</summary>
    public string? AuthorizationNumber { get; set; }

    /// <summary>Fecha y hora de autorización del SRI.</summary>
    public DateTime? AuthorizationDate { get; set; }

    /// <summary>Estado: PENDIENTE | AUTORIZADO | NO_AUTORIZADO | ERROR</summary>
    public string? ElectronicStatus { get; set; }

    /// <summary>Ruta interna donde se guardó el XML autorizado.</summary>
    public string? XmlPath { get; set; }

    /// <summary>Mensaje de error del SRI o del sistema si la emisión falló.</summary>
    public string? SriErrorMessage { get; set; }

    // Relationships
    public Employee? Employee { get; set; }
    public Client? Client { get; set; }
    public ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
}
