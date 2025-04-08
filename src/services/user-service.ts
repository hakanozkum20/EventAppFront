'use client'

import { createApiService, ApiResponse } from '@/lib/http';
import { User, UserCreateInput, UserUpdateInput } from '@/types/user';

// Kullanıcı servisi oluşturma
const userService = createApiService<User, UserCreateInput, UserUpdateInput>('User');

// Özel metodlar eklemek için servisi genişletme
const extendedUserService = {
  // Temel CRUD işlemleri
  getAll: userService.getAll.bind(userService),
  getById: userService.getById.bind(userService),
  create: userService.create.bind(userService),
  update: userService.update.bind(userService),
  delete: userService.delete.bind(userService),

  // Mevcut kullanıcıyı getir
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await userService.getByAction('me');
    // Tip dönüşümü yaparak User[] -> User dönüşümünü sağlıyoruz
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return { data: response.data[0] };
    }
    // Eğer veri yoksa boş bir yanıt döndür
    return { error: response.error, message: response.message, statusCode: response.statusCode } as ApiResponse<User>;
  },

  // Kullanıcı rolünü güncelle
  async updateRole(userId: string, role: string): Promise<ApiResponse<User>> {
    return userService.postToIdAndAction(userId, 'role', { role });
  },

  // Kullanıcıyı aktif/pasif yap
  async toggleActive(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    return userService.postToIdAndAction(userId, 'toggle-active', { isActive });
  }
};

export default extendedUserService;
