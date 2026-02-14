import api from './api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'Info' | 'Warning' | 'Success' | 'Error';
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export const notificationService = {
    getAll: async () => {
        const response = await api.get<Notification[]>('/notifications');
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await api.get<number>('/notifications/unread-count');
        return response.data;
    },
    markAsRead: async (id: number) => {
        await api.post(`/notifications/${id}/read`);
    },
    markAllAsRead: async () => {
        await api.post('/notifications/read-all');
    },
    delete: async (id: number) => {
        await api.delete(`/notifications/${id}`);
    }
};
