import api from './api';

export interface Client {
    id: number;
    name: string;
    cedulaRuc?: string;
    phone?: string;
    address?: string;
    email?: string;
    registeredAt?: string;
}

export type ClientCreateDto = Omit<Client, 'id'>;

export const clientService = {
    getAll: async () => {
        const response = await api.get<Client[]>('/clients');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Client>(`/clients/${id}`);
        return response.data;
    },
    create: async (client: Omit<Client, 'id'>) => {
        const response = await api.post<Client>('/clients', client);
        return response.data;
    },
    update: async (id: number, client: Client) => {
        await api.put(`/clients/${id}`, client);
    },
    delete: async (id: number) => {
        await api.delete(`/clients/${id}`);
    }
};
