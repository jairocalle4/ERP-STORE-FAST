export interface InventoryMovement {
    id: number;
    productId: number;
    type: string;
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    reason: string;
    userId: number;
    createdAt: string;
    saleId?: number;
    purchaseId?: number;
    user?: {
        firstName: string;
        lastName: string;
        username: string;
    };
}
