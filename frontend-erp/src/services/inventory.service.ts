import api from './api';
import type { InventoryMovement } from '../types/inventory';

export const inventoryService = {
    getKardex: async (productId: number): Promise<InventoryMovement[]> => {
        const response = await api.get<InventoryMovement[]>(`/inventory/kardex/${productId}`);
        return response.data;
    }
};
