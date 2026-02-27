import api from './api';
import type { PagedResponse } from './types';
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
    isVoid: boolean;
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
    getAll: async (page = 1, pageSize = 20) => {
        const response = await api.get<PagedResponse<Purchase>>('/purchases', {
            params: { page, pageSize }
        });
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
    void: async (id: number) => {
        const response = await api.post(`/purchases/${id}/void`);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/purchases/${id}`);
    }
};
