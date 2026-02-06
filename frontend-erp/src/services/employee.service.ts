import api from './api';

export interface Employee {
    id: number;
    name: string;
    role?: string;
    isActive: boolean;
}

export type EmployeeCreateDto = Omit<Employee, 'id'>;

export const employeeService = {
    getAll: async () => {
        const response = await api.get<Employee[]>('/employees');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Employee>(`/employees/${id}`);
        return response.data;
    },
    create: async (employee: Omit<Employee, 'id'>) => {
        const response = await api.post<Employee>('/employees', employee);
        return response.data;
    },
    update: async (id: number, employee: Employee) => {
        await api.put(`/employees/${id}`, employee);
    },
    delete: async (id: number) => {
        await api.delete(`/employees/${id}`);
    }
};
