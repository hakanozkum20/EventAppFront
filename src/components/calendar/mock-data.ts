import { CalendarEvent } from './types'

// Bugünün tarihini al
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()

export type UserRole = 'super_admin' | 'company_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Düğün Organizasyon A.Ş.',
    address: 'İstanbul, Türkiye',
    phone: '0212 555 55 55',
    email: 'info@dugunorg.com'
  },
  {
    id: '2',
    name: 'Mutlu Düğün Ltd.',
    address: 'Ankara, Türkiye',
    phone: '0312 444 44 44',
    email: 'info@mutludugun.com'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@example.com',
    role: 'super_admin'
  },
  {
    id: '2',
    name: 'Düğün Organizasyon Yöneticisi',
    email: 'dugunorg@example.com',
    role: 'company_admin',
    companyId: '1'
  },
  {
    id: '3',
    name: 'Mutlu Düğün Yöneticisi',
    email: 'mutludugun@example.com',
    role: 'company_admin',
    companyId: '2'
  }
];

// Mock etkinlikler
export const mockEvents: CalendarEvent[] = [
  // Düğün Organizasyon A.Ş. Etkinlikleri
  {
    id: '1',
    title: 'Ahmet & Ayşe Düğün',
    description: 'Ahmet ve Ayşe\'nin düğün töreni',
    startDate: new Date(currentYear, currentMonth, 15, 19, 0),
    endDate: new Date(currentYear, currentMonth, 15, 23, 0),
    type: 'wedding',
    companyId: '1'
  },
  {
    id: '2',
    title: 'Mehmet & Fatma Nişan',
    description: 'Mehmet ve Fatma\'nın nişan töreni',
    startDate: new Date(currentYear, currentMonth, 20, 18, 30),
    endDate: new Date(currentYear, currentMonth, 20, 22, 30),
    type: 'engagement',
    companyId: '1'
  },
  {
    id: '3',
    title: 'Zeynep Kına Gecesi',
    description: 'Zeynep\'in kına gecesi',
    startDate: new Date(currentYear, currentMonth, 10, 20, 0),
    endDate: new Date(currentYear, currentMonth, 10, 23, 59),
    type: 'henna',
    companyId: '1'
  },
  // Mutlu Düğün Ltd. Etkinlikleri
  {
    id: '4',
    title: 'Ali & Elif Düğün',
    description: 'Ali ve Elif\'in düğün töreni',
    startDate: new Date(currentYear, currentMonth, 25, 18, 0),
    endDate: new Date(currentYear, currentMonth, 25, 23, 0),
    type: 'wedding',
    companyId: '2'
  },
  {
    id: '5',
    title: 'Can & Deniz Nişan',
    description: 'Can ve Deniz\'in nişan töreni',
    startDate: new Date(currentYear, currentMonth, 5, 19, 30),
    endDate: new Date(currentYear, currentMonth, 5, 22, 30),
    type: 'engagement',
    companyId: '2'
  },
  {
    id: '6',
    title: 'Selin Kına',
    description: 'Selin\'in kına gecesi',
    startDate: new Date(currentYear, currentMonth, 8, 20, 0),
    endDate: new Date(currentYear, currentMonth, 8, 23, 30),
    type: 'henna',
    companyId: '2'
  }
] 