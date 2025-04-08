'use client'

import { ApiResponse, AuthResponse, User, UserCreateInput, UserUpdateInput } from '@/types/user'
import { apiClient } from '@/lib/http/http-client';

export class ApiService {
  private getToken(): string | undefined {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined
  }

  private checkAuth<T>(): ApiResponse<T> | null {
    const token = this.getToken()
    if (!token) {
      return { error: 'Not authenticated' }
    }
    return null
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const data = await apiClient.post<AuthResponse>('/auth/login', {
        body: { email, password }
      });

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred during login'
      }
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
      return { message: 'Logged out successfully' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred during logout'
      }
    }
  }

  // User management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const authCheck = this.checkAuth<User>()
      if (authCheck) return authCheck

      const token = this.getToken()
      const data = await apiClient.get<User>('/users/me', { token });
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const authCheck = this.checkAuth<User[]>()
      if (authCheck) return authCheck

      const token = this.getToken()
      const data = await apiClient.get<User[]>('/users', { token });
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async createUser(userData: UserCreateInput): Promise<ApiResponse<User>> {
    try {
      const authCheck = this.checkAuth<User>()
      if (authCheck) return authCheck

      const token = this.getToken()
      const data = await apiClient.post<User>('/users', {
        body: userData,
        token
      });

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async updateUser(userId: string, userData: UserUpdateInput): Promise<ApiResponse<User>> {
    try {
      const authCheck = this.checkAuth<User>()
      if (authCheck) return authCheck

      const token = this.getToken()
      const data = await apiClient.put<User>(`/users/${userId}`, {
        body: userData,
        token
      });

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const authCheck = this.checkAuth<void>()
      if (authCheck) return authCheck

      const token = this.getToken()
      const data = await apiClient.delete<void>(`/users/${userId}`, { token });
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred'
      }
    }
  }
}

// Singleton instance
export const apiService = new ApiService();
