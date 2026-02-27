import api from './api';
import type { PagedResponse } from './types';

export interface ExpenseCategory {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CreateExpenseCategoryDto {
    name: string;
    description?: string;
}

export const expenseCategoriesService = {
    getAll: async (page = 1, pageSize = 20) => {
        const response = await api.get<PagedResponse<ExpenseCategory>>('/expense-categories', {
            params: { page, pageSize }
        });
        return response.data;
    },

    create: async (data: CreateExpenseCategoryDto) => {
        const response = await api.post<ExpenseCategory>('/expense-categories', data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/expense-categories/${id}`);
    }
};
