import type { User } from '../types/auth.types';

const API_BASE_URL = import.meta.env.API_BASE_URL;

export const apiService = {
  async signup(email: string, name: string, password: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: data.user, token: data.access_token };
    } else {
      return { success: false, message: data.message || 'Signup failed' };
    }
  },

  async signin(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: data.user, token: data.access_token };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  },

  async getProfile(token: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: data };
    } else {
      return { success: false, message: data.message || 'Failed to get profile' };
    }
  },
};