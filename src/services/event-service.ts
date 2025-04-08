'use client'

import { createApiService } from '@/lib/http';

// Etkinlik tipi tanımlama
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  companyId: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

// Etkinlik oluşturma DTO
export interface EventCreateInput {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  companyId: string;
  isActive?: boolean;
}

// Etkinlik güncelleme DTO
export interface EventUpdateInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  companyId?: string;
  isActive?: boolean;
}

// Etkinlik servisi oluşturma
const eventService = createApiService<Event, EventCreateInput, EventUpdateInput>('Event');

// Özel metodlar eklemek için servisi genişletme
const extendedEventService = {
  // Temel CRUD işlemleri
  getAll: eventService.getAll.bind(eventService),
  getById: eventService.getById.bind(eventService),
  create: eventService.create.bind(eventService),
  update: eventService.update.bind(eventService),
  delete: eventService.delete.bind(eventService),
  
  // Şirkete göre etkinlikleri getir
  async getEventsByCompany(companyId: string) {
    return eventService.getByAction('by-company', { companyId });
  },
  
  // Tarih aralığına göre etkinlikleri getir
  async getEventsByDateRange(startDate: string, endDate: string) {
    return eventService.getByAction('by-date-range', { startDate, endDate });
  },
  
  // Etkinliği iptal et
  async cancelEvent(eventId: string, reason: string) {
    return eventService.postToIdAndAction(eventId, 'cancel', { reason });
  }
};

export default extendedEventService;
