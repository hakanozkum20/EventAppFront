'use client'

import { httpClient, RequestOptions } from './http-client';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export class ApiService<T, CreateDto = T, UpdateDto = Partial<T>> {
  private controller: string;

  constructor(controller: string) {
    this.controller = controller;
  }

  // Token almak için yardımcı metod
  // Şu anda kullanılmıyor, ama ileride gerekebilir
  // private getToken(): string | undefined {
  //   return typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined;
  // }

  // Token kontrolü için yardımcı metod
  // Şu anda kullanılmıyor, ama ileride gerekebilir
  // private checkAuth<R>(): ApiResponse<R> | null {
  //   const token = this.getToken();
  //   if (!token) {
  //     return { error: 'Not authenticated' };
  //   }
  //   return null;
  // }

  private handleError(error: any): ApiResponse<any> {
    // Hata mesajını al
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';

    // Hata kodunu kontrol et (varsa)
    const statusCode = error.statusCode || error.status || undefined;

    return {
      error: errorMessage,
      statusCode
    };
  }

  // Build endpoint path with controller and optional action and id
  private buildEndpoint(action?: string, id?: string | number): string {
    let endpoint = `/${this.controller}`;

    if (id !== undefined) {
      endpoint += `/${id}`;
    }

    if (action) {
      endpoint += `/${action}`;
    }

    return endpoint;
  }

  // Generic request method
  private async makeRequest<R>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    action?: string,
    id?: string | number,
    data?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<R>> {
    try {
      // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
      // if (requiresAuth) {
      //   const authCheck = this.checkAuth<R>();
      //   if (authCheck) return authCheck;
      // }

      // Geçici olarak token göndermiyoruz
      // const token = requiresAuth ? this.getToken() : undefined;
      const options: RequestOptions = { };

      if (data) {
        options.body = data;
      }

      if (params) {
        options.params = params;
      }

      const endpoint = this.buildEndpoint(action, id);
      const result = await httpClient.request<R>(method, endpoint, options);

      return { data: result };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // CRUD operations
  async getAll(params?: Record<string, string>): Promise<ApiResponse<T[]>> {
    return this.makeRequest<T[]>('GET', undefined, undefined, undefined, params);
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', undefined, id);
  }

  async create(data: CreateDto): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', undefined, undefined, data);
  }

  async update(id: string | number, data: UpdateDto): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', undefined, id, data);
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('DELETE', undefined, id);
  }

  // Custom action methods
  async getByAction(action: string, params?: Record<string, string>): Promise<ApiResponse<T[]>> {
    return this.makeRequest<T[]>('GET', action, undefined, undefined, params);
  }

  async getByIdAndAction(id: string | number, action: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', action, id, undefined, params);
  }

  async postToAction(action: string, data: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('POST', action, undefined, data);
  }

  async postToIdAndAction(id: string | number, action: string, data: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('POST', action, id, data);
  }

  // Public methods
  async publicGet(action: string, params?: Record<string, string>): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('GET', action, undefined, undefined, params);
  }

  async publicPost(action: string, data: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('POST', action, undefined, data);
  }
}

// Factory function to create API services
export function createApiService<T, CreateDto = T, UpdateDto = Partial<T>>(controller: string): ApiService<T, CreateDto, UpdateDto> {
  return new ApiService<T, CreateDto, UpdateDto>(controller);
}
