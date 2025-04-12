'use client'

import { ApiResponse } from '@/lib/http';
import { User, UserCreateInput, UserUpdateInput } from '@/types/user';
import { httpClient } from '@/lib/http/http-client';

// Token almak için yardımcı fonksiyon
function getToken(): string | undefined {
  return typeof window !== 'undefined' ? localStorage.getItem('auth_token') || undefined : undefined;
}

// Kullanıcı işlemleri
export async function getUsers(): Promise<ApiResponse<User[]>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.get<User[]>('/users', { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.get<User>(`/users/${id}`, { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function createUser(userData: UserCreateInput): Promise<ApiResponse<User>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.post<User>('/users', {
      body: userData,
      token
    });
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateUser(id: string, userData: UserUpdateInput): Promise<ApiResponse<User>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.put<User>(`/users/${id}`, {
      body: userData,
      token
    });
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.delete<void>(`/users/${id}`, { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

// Şirket işlemleri
export async function getCompanies(): Promise<ApiResponse<any[]>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.get<any[]>('/companies', { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function getCompanyById(id: string): Promise<ApiResponse<any>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.get<any>(`/companies/${id}`, { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function createCompany(companyData: any): Promise<ApiResponse<any>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.post<any>('/companies', {
      body: companyData,
      token
    });
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCompany(id: string, companyData: any): Promise<ApiResponse<any>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.put<any>(`/companies/${id}`, {
      body: companyData,
      token
    });
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteCompany(id: string): Promise<ApiResponse<void>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.delete<void>(`/companies/${id}`, { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

// Hata işleme
function handleError(error: any): ApiResponse<any> {
  // Hata mesajını al
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  
  // Hata kodunu kontrol et (varsa)
  const statusCode = error.statusCode || error.status || undefined;
  
  return {
    error: errorMessage,
    statusCode
  };
}

// Oturum işlemleri
export async function login(email: string, password: string): Promise<ApiResponse<{ token: string, user: User }>> {
  try {
    const data = await httpClient.post<{ token: string, user: User }>('/auth/login', {
      body: { email, password }
    });
    
    // Token'ı localStorage'a kaydet
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function register(userData: UserCreateInput): Promise<ApiResponse<User>> {
  try {
    const data = await httpClient.post<User>('/auth/register', {
      body: userData
    });
    
    return { data };
  } catch (error) {
    return handleError(error);
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token');
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }
    
    const data = await httpClient.get<User>('/auth/me', { token });
    return { data };
  } catch (error) {
    return handleError(error);
  }
}
