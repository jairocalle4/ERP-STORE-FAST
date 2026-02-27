namespace ErpStore.Domain.Entities;

public enum Role
{
    Admin,      // Full control
    Gerente,    // Store manager
    Vendedor,   // Cashier / Sales
    Bodeguero,  // Inventory / Warehouse
    Customer    // External client (keep for compatibility)
}
