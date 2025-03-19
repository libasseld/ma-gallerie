import { create } from 'zustand';
import { User } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>((set) => {
  // Vérifier si localStorage est disponible (côté client uniquement)
  const isClient = typeof window !== 'undefined';
  
  return {
    user: null,
    token: isClient ? localStorage.getItem('token') : null,
    isAuthenticated: isClient ? !!localStorage.getItem('token') : false,
    setAuth: (user, token) => {
      if (isClient) {
        localStorage.setItem('token', token);
      }
      set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      if (isClient) {
        localStorage.removeItem('token');
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});