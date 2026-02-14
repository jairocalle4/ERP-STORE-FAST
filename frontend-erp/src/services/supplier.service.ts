import api from './api';

export interface Supplier {
    id: number;
    name: string;
    taxId: string;
    phone: string;
    email: string;
    address: string;
    contactName: string;
    isActive: boolean;
}

export const supplierService = {
    getAll: async () => {
        const response = await api.get<Supplier[]>('/suppliers');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Supplier>(`/suppliers/${id}`);
        return response.data;
    },
    create: async (supplier: Partial<Supplier>) => {
        const response = await api.post<Supplier>('/suppliers', supplier);
        return response.data;
    },
    update: async (id: number, supplier: Partial<Supplier>) => {
        await api.put(`/suppliers/${id}`, supplier);
    },
    delete: async (id: number) => {
        await api.delete(`/suppliers/${id}`);
    }
};
