import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
    username: string;
    role: string;
    permissions: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    login: (token: string, username: string, role: string, permissions: string[]) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: (token, username, role, permissions) => {
                set({ token, user: { username, role, permissions } });
                // Configure axios default header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            },
            updateUser: (updatedUser) => {
                set((state) => ({ user: state.user ? { ...state.user, ...updatedUser } : null }));
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
