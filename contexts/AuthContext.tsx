"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'provider' | 'client';
}

interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  id?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: 'admin' | 'provider') => Promise<void>;
  firebaseLogin: (firebaseToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData') || localStorage.getItem('user');
    
    console.log('AuthContext - Checking stored auth:', { storedToken, storedUser });
    
    if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        const userData = JSON.parse(storedUser);
        console.log('AuthContext - Parsed user data:', userData);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clean up corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'provider') => {
    setIsLoading(true);
    try {
      console.log('AuthContext - Starting login:', { email, role });
      const response = await (role === 'admin' 
        ? authApi.adminLogin(email, password)
        : authApi.providerLogin(email, password)) as AuthResponse;

      console.log('AuthContext - Login response:', response);

      const userData = {
        id: response.user?.id || response.id || '',
        email: response.user?.email || email,
        name: response.user?.name || response.name,
        role: role
      };

      console.log('AuthContext - Setting user data:', userData);
      setUser(userData);
      setToken(response.access_token || response.token || '');
      
      // Store in both key formats for compatibility
      const token = response.access_token || response.token || '';
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('AuthContext - Login completed successfully');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const firebaseLogin = async (firebaseToken: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.firebaseLogin(firebaseToken) as AuthResponse;

      const userData: User = {
        id: response.user?.id || response.id || '',
        email: response.user?.email || '',
        name: response.user?.name || response.name,
        role: 'provider',
      };

      setUser(userData);
      setToken(response.access_token || response.token || '');
      
      localStorage.setItem('authToken', response.access_token || response.token || '');
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Firebase login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out user');
    setUser(null);
    setToken(null);
    
    // Clean up all localStorage keys to ensure complete logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('AuthContext - Logout completed');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    firebaseLogin,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
