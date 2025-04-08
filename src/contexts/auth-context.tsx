'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types/user'
import { useRouter } from 'next/navigation'
import authService from '@/services/auth-service'
import userService from '@/services/user-service'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      setError(null)
      
      // Token kontrolü
      if (!authService.isAuthenticated()) {
        setIsLoading(false)
        return
      }
      
      try {
        // Mevcut kullanıcı bilgilerini al
        const response = await userService.getCurrentUser()
        
        if (response.error) {
          // Token geçersiz veya süresi dolmuş olabilir
          console.error('Auth check error:', response.error)
          setError(response.error)
          
          // Token'i temizle ve kullanıcıyı çıkış yaptır
          authService.logout()
          setUser(null)
        } else if (response.data) {
          // Kullanıcı bilgilerini güncelle
          setUser(response.data)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Hata durumunda token'i temizle
        authService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    const response = await authService.login(email, password)
    
    if (response.error) {
      setError(response.error)
      setIsLoading(false)
      return false
    }
    
    if (response.data) {
      // .NET backend'den gelen yanıt yapısına göre kullanıcı bilgilerini al
      // response.data.user veya doğrudan response.data olabilir
      const userData = response.data.user || response.data
      setUser(userData)
      
      // Giriş başarılı olduktan sonra kullanıcı bilgilerini güncellemek için
      // getCurrentUser() metodunu çağırabilirsiniz
      const userResponse = await userService.getCurrentUser()
      if (userResponse.data) {
        setUser(userResponse.data)
      }
      
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = async () => {
    setIsLoading(true)
    
    // .NET backend'e çıkış isteği gönder
    // Backend'iniz bir logout endpoint'i sağlıyorsa bu çağrı yapılır
    // Eğer backend'iniz sadece token doğrulaması yapıyorsa,
    // client tarafında token'i silmek yeterli olabilir
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Hata olsa bile devam et ve local token'i temizle
    }
    
    // Kullanıcı durumunu sıfırla
    setUser(null)
    setError(null)
    
    // Login sayfasına yönlendir
    router.push('/login')
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
