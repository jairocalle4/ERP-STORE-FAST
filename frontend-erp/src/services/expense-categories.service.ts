import api from './api';

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
    getAll: async () => {
        const response = await api.get<ExpenseCategory[]>('/expense-categories');
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
