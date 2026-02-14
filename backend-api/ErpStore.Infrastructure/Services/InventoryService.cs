using ErpStore.Application.Interfaces;
using ErpStore.Domain.Entities;
using ErpStore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ErpStore.Infrastructure.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task RegisterMovementAsync(int productId, string type, int quantity, int userId, string reason, int? saleId = null, int? purchaseId = null)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return;

        // Logic: Quantity is delta.
        // If caller already updated stock, product.Stock is NEW stock.
        // Previous = New - Diff.
        
        var newStock = product.Stock;
        var previousStock = newStock - quantity; 

        var movement = new InventoryMovement
        {
            ProductId = productId,
            Type = type,
            Quantity = quantity,
            StockBefore = previousStock,
            StockAfter = newStock,
            UserId = userId,
            Reason = reason,
            CreatedAt = DateTime.UtcNow,
            SaleId = saleId,
            PurchaseId = purchaseId
        };

        _context.InventoryMovements.Add(movement);
        // Do not call SaveChanges here, let caller handle transaction/save.
    }

    public async Task<List<InventoryMovement>> GetKardexByProductAsync(int productId)
    {
        return await _context.InventoryMovements
            .Include(m => m.User)
            .Where(m => m.ProductId == productId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}
