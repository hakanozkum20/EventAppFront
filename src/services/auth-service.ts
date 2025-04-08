'use client'

import { createApiService, ApiResponse } from '@/lib/http';
import { AuthResponse } from '@/types/user';

// Auth servisi oluşturma
const authApiService = createApiService<any>('Auth');

// Login ve logout işlemleri için özel servis
const authService = {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await authApiService.publicPost('login', { email, password });

      if (response.data && response.data.token) {
        // Token'ı localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }

      return response;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      // Token'ı localStorage'dan sil
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred during logout'
      };
    }
  },

  // Token kontrolü
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  // Token'ı getir
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
};

export default authService;
