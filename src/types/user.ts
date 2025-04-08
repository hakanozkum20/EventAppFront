export type UserRole = 'SAAS_ADMIN' | 'COMPANY_ADMIN' | 'MODERATOR' | 'VIEWER'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface UserCreateInput {
  email: string
  name: string
  password: string
  role: UserRole
  companyId?: string
  isActive?: boolean
}

export interface UserUpdateInput {
  email?: string
  name?: string
  role?: UserRole
  companyId?: string
  isActive?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  statusCode?: number
}