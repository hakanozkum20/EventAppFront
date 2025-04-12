'use client'

import { createApiService, ApiResponse } from '@/lib/http';
import { PaginatedResponse, PaginationParams } from '@/types/pagination';

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

  // Sayfalama ile şirketleri getir
  async getPaginated(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Company>>> {
    const queryParams = {
      page: params.page.toString(),
      size: params.size.toString()
    };
    // API'den gelen yanıtı PaginatedResponse tipine dönüştür
    const response = await companyService.getByAction('paginated', queryParams);

    // Tip dönüşümü için kontrol
    if (response.data) {
      // API'den gelen yanıtın PaginatedResponse formatında olduğunu varsayıyoruz
      // Eğer API'den gelen yanıt farklı bir formatta ise, burada dönüştürme işlemi yapılabilir
      return response as unknown as ApiResponse<PaginatedResponse<Company>>;
    }

    // Hata durumunda boş bir PaginatedResponse döndür
    return {
      error: response.error,
      data: {
        items: [],
        totalCount: 0,
        pageCount: 0,
        currentPage: params.page,
        pageSize: params.size,
        hasPreviousPage: false,
        hasNextPage: false
      }
    };
  },

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
