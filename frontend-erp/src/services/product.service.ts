import api from './api';

export interface ProductImage {
    id: number;
    url: string;
    isCover: boolean;
    order: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    barcode: string;
    cost: number;
    price: number;
    stock: number;
    minStock: number;
    isActive: boolean;
    videoUrl: string;
    categoryId: number;
    subcategoryId?: number;
    category?: { name: string };
    subcategory?: { name: string };
    images: ProductImage[];
}

export const productService = {
    getAll: async (includeInactive = false) => {
        const response = await api.get<Product[]>(`/products?includeInactive=${includeInactive}`);
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/products/${id}`);
    }
};
