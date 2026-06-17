import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: { username: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  activate: (uid: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fournit le contexte d'authentification, les fonctions de login/logout/register/activate,
 * et l'état de l'utilisateur courant.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // À l'initialisation, vérifier si un token est stocké
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // On pourrait appeler un endpoint `/me` pour récupérer les infos utilisateur
      // Pour simplifier, on considère que le token est valide.
      setUser({ username: 'utilisateur' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const register = async (data: any) => {
    await apiClient.post('/auth/register/', data);
  };

  const activate = async (uid: string, token: string) => {
    await apiClient.get(`/auth/activate/${uid}/${token}/`);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, activate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};