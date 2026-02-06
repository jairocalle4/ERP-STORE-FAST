import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
    username: string;
    role: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    login: (token: string, username: string, role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (token, username, role) => {
                set({ token, user: { username, role } });
                // Configure axios default header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            },
            logout: () => {
                set({ token: null, user: null });
                delete axios.defaults.headers.common['Authorization'];
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
