import React, { createContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/auth.types';
import { apiService } from '../services/api.service';

export const AuthContext = createContext<AuthContextType | null>(null);

// In-memory storage for demo (replaces localStorage for artifact compatibility)
let memoryStorage = {
  user: null as User | null,
  token: null as string | null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user on app start
    if (memoryStorage.user && memoryStorage.token) {
      setUser(memoryStorage.user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.signin(email, password);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        memoryStorage.user = result.user;
        memoryStorage.token = result.token;
        return true;
      } else {
        setError(result.message || 'Login failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.signup(email, name, password);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        memoryStorage.user = result.user;
        memoryStorage.token = result.token;
        return true;
      } else {
        setError(result.message || 'Signup failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    memoryStorage.user = null;
    memoryStorage.token = null;
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};