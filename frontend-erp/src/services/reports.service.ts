import api from './api';

export interface KpiStats {
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    totalExpenses: number;
    netProfit: number;
    totalTransactions: number;
    averageTicket: number;
}

export interface SalesTrend {
    period: string; // "dd/MM"
    date: string;
    revenue: number;
    expenses: number;
    netProfit: number;
}

export interface TopProduct {
    productName: string;
    quantitySold: number;
    totalRevenue: number;
}

export interface InventoryValuation {
    categoryName: string;
    totalValue: number;
    productCount: number;
    percentage: number;
}

export interface SaleProfit {
    saleId: number;
    noteNumber: string;
    date: string;
    employeeName: string;
    productNames: string;
    totalQuantity: number;
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    marginPercentage: number;
    paymentMethod: string;
}

// Helper to format date as yyyy-MM-dd
const formatDateParam = (date: Date | null) => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
};

export const reportsService = {
    getKpiStats: async (startDate: Date | null, endDate: Date | null) => {
        const response = await api.get<KpiStats>('/reports/kpi-stats', {
            params: { startDate: formatDateParam(startDate), endDate: formatDateParam(endDate) }
        });
        return response.data;
    },

    getSalesTrend: async (startDate: Date | null, endDate: Date | null) => {
        const response = await api.get<SalesTrend[]>('/reports/sales-trend', {
            params: { startDate: formatDateParam(startDate), endDate: formatDateParam(endDate) }
        });
        return response.data;
    },

    getTopProducts: async (startDate: Date | null, endDate: Date | null) => {
        const response = await api.get<TopProduct[]>('/reports/top-products', {
            params: { startDate: formatDateParam(startDate), endDate: formatDateParam(endDate) }
        });
        return response.data;
    },

    getInventoryValuation: async () => {
        const response = await api.get<InventoryValuation[]>('/reports/inventory-valuation');
        return response.data;
    },

    getSalesProfit: async (startDate: Date | null, endDate: Date | null) => {
        const response = await api.get<SaleProfit[]>('/reports/sales-profit', {
            params: { startDate: formatDateParam(startDate), endDate: formatDateParam(endDate) }
        });
        return response.data;
    }
};
