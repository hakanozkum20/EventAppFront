'use client'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  token?: string;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(options?: RequestOptions): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options?.headers,
    });

    // Geçici olarak token kullanımını devre dışı bırakıyoruz
    // if (options?.token) {
    //   headers.append('Authorization', `Bearer ${options.token}`);
    // }

    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  async request<T>(method: HttpMethod, endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const requestOptions: RequestInit = {
      method,
      headers: this.getHeaders(options),
    };

    if (options?.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw await this.handleError(response);
    }

    // Handle empty responses (like for DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, options);
  }

  async put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  async patch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, options);
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const errorData = await response.json();
      return new Error(errorData.error || `HTTP error ${response.status}`);
    } catch (error) {
      return new Error(`HTTP error ${response.status}`);
    }
  }
}

// Singleton instance
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const httpClient = new HttpClient(API_URL);
