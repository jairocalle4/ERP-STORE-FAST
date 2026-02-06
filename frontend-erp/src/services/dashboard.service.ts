import api from './api';

export interface DashboardStats {
    salesToday: number;
    cashToday: number;
    lowStockCount: number;
    outOfStockCount: number;
    chartData: { name: string, ventas: number }[];
}

export const dashboardService = {
    getStats: async () => {
        const response = await api.get<DashboardStats>('/dashboard/stats');
        return response.data;
    }
};
