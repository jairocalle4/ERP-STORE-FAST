
import api from './api';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string; // Optional for updates
}

export const userService = {
    getProfile: async () => {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    updateProfile: async (user: Partial<User>) => {
        const response = await api.put('/users/me', user);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    createUser: async (user: Partial<User>) => {
        const response = await api.post<User>('/users', user);
        return response.data;
    },

    updateUser: async (id: number, user: Partial<User>) => {
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    },

    deleteUser: async (id: number) => {
        await api.delete(`/users/${id}`);
    }
};
