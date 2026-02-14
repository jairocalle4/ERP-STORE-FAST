import api from './api';
import type { Product } from './product.service';
import type { Supplier } from './supplier.service';

export interface PurchaseDetail {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: Product;
}

export interface Purchase {
    id: number;
    supplierId: number;
    date: string;
    invoiceNumber: string;
    total: number;
    status: string;
    paymentMethod: string;
    notes: string;
    supplier?: Supplier;
    details: PurchaseDetail[];
}

export interface CreatePurchaseDto {
    supplierId: number;
    date: string;
    invoiceNumber: string;
    paymentMethod: string;
    status: string;
    notes: string;
    details: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
}

export const purchaseService = {
    getAll: async () => {
        const response = await api.get<Purchase[]>('/purchases');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Purchase>(`/purchases/${id}`);
        return response.data;
    },
    create: async (purchase: CreatePurchaseDto) => {
        const response = await api.post<Purchase>('/purchases', purchase);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/purchases/${id}`);
    }
};
