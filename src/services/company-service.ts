'use client'

import { createApiService } from '@/lib/http';

// Şirket tipi tanımlama
export interface Company {
  id: string; // Guid tipini string olarak kullanıyoruz
  name: string;
  customerId?: string; // Guid tipini string olarak kullanıyoruz

  isActive: boolean; // Frontend için ekstra alan
  createdDate: string; // DateTime tipini string olarak kullanıyoruz
  updatedDate: string; // DateTime tipini string olarak kullanıyoruz
}

// Şirket oluşturma DTO
export interface CompanyCreateInput {
  name: string;
  customerId?: string | null; // Guid tipini string olarak kullanıyoruz veya null olabilir
}

// Şirket güncelleme DTO
export interface CompanyUpdateInput {
  name: string;
  customerId?: string | null; // Guid tipini string olarak kullanıyoruz veya null olabilir
}

// Şirket servisi oluşturma
const companyService = createApiService<Company, CompanyCreateInput, CompanyUpdateInput>('Company');

// Özel metodlar eklemek için servisi genişletme
const extendedCompanyService = {
  // Temel CRUD işlemleri
  getAll: companyService.getAll.bind(companyService),
  getById: companyService.getById.bind(companyService),
  create: companyService.create.bind(companyService),
  update: companyService.update.bind(companyService),
  delete: companyService.delete.bind(companyService),

  // Aktif şirketleri getir
  async getActiveCompanies() {
    return companyService.getByAction('active');
  },

  // Şirket kullanıcılarını getir
  async getCompanyUsers(companyId: string) {
    return companyService.getByIdAndAction(companyId, 'users');
  }
};

export default extendedCompanyService;
