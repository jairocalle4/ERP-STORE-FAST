using ErpStore.Domain.Entities;

namespace ErpStore.Application.Interfaces;

public interface IInventoryService
{
    Task RegisterMovementAsync(int productId, string type, int quantity, int userId, string reason, int? saleId = null, int? purchaseId = null);
    Task<List<InventoryMovement>> GetKardexByProductAsync(int productId);
}
