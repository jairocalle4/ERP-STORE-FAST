import api from './api';
import type { Client } from './client.service';
import type { Employee } from './employee.service';

// We might need to adjust this depending on the actual backend response for lists vs details
export interface SaleDetail {
    id: number;
    saleId: number;
    productId: number;
    productName?: string; // If backend includes it
    quantity: number;
    subtotal: number;
    unitPrice: number;
    product?: {
        name: string;
        sku?: string;
    }
}

export interface Sale {
    id: number;
    date: string;
    employeeId: number;
    total: number;
    observation?: string;
    clientId?: number;
    noteNumber?: string;
    isVoid: boolean;
    paymentMethod: string;
    client?: Client;
    employee?: Employee;
    saleDetails?: SaleDetail[];
}

export interface CreateSaleDetailDto {
    productId: number;
    quantity: number;
    unitPrice: number; // Usually taken from product, but can be overridden or snapshotted
}

export interface CreateSaleDto {
    clientId?: number;
    employeeId: number;
    observation?: string;
    paymentMethod: string;
    details: CreateSaleDetailDto[];
}

export const saleService = {
    getAll: async () => {
        const response = await api.get<Sale[]>('/sales');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Sale>(`/sales/${id}`);
        return response.data;
    },
    create: async (sale: CreateSaleDto) => {
        const response = await api.post<Sale>('/sales', sale);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/sales/${id}`);
    },
    void: async (id: number) => {
        const response = await api.post<Sale>(`/sales/${id}/void`);
        return response.data;
    }
};
