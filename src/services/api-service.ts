'use client'

import { createApiService, ApiResponse } from '@/lib/http';
import { User, UserCreateInput, UserUpdateInput } from '@/types/user';

// Kullanıcı servisi
export const userService = createApiService<User, UserCreateInput, UserUpdateInput>('User');

// Şirket servisi
export interface Company {
  id: string;
  name: string;
  customerId?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyCreateInput {
  name: string;
  customerId?: string | null;
  isActive?: boolean;
}

export interface CompanyUpdateInput {
  name?: string;
  customerId?: string | null;
  isActive?: boolean;
}

export const companyService = createApiService<Company, CompanyCreateInput, CompanyUpdateInput>('Company');

// Diğer servisler buraya eklenebilir
// Örnek: export const productService = createApiService<Product>('products');

// Auth servisi için özel metodlar
export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ token: string, user: User }>> {
    try {
      const response = await companyService.publicPost('auth/login', { email, password });

      // Token'ı localStorage'a kaydet
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      return response;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  async register(userData: UserCreateInput): Promise<ApiResponse<User>> {
    return companyService.publicPost('auth/register', userData);
  },

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await userService.getByAction('me');
    // Tip dönüşümü yaparak User[] -> User dönüşümünü sağlıyoruz
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return { data: response.data[0] };
    }
    // Eğer veri yoksa boş bir yanıt döndür
    return { error: response.error, message: response.message, statusCode: response.statusCode } as ApiResponse<User>;
  },

  getToken(): string | undefined {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
