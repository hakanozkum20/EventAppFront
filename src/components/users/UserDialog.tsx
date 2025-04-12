'use client'

import { useEffect, useState } from 'react'
import { User, UserCreateInput, UserUpdateInput } from '@/types/user'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import userService from '@/services/user-service'
// Geçici olarak auth kontekstini devre dışı bırakıyoruz
// import { useAuth } from '@/contexts/auth-context'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  user: User | null
  onUserCreated?: () => void // Yeni kullanıcı oluşturulduğunda çağrılacak fonksiyon
  onUserUpdated?: () => void // Kullanıcı güncellendiğinde çağrılacak fonksiyon
}

export function UserDialog({ open, onOpenChange, onClose, user, onUserCreated, onUserUpdated }: UserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserCreateInput>({
    email: '',
    name: '',
    password: '',
    role: 'VIEWER',
    isActive: true
  })
  // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
  // const { user: currentUser } = useAuth()
  const currentUser = { role: 'SAAS_ADMIN', companyId: '1' } // Geçici olarak admin rolü veriyoruz

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        password: '', // Şifre güncelleme için boş bırakıyoruz
        role: user.role,
        isActive: user.isActive
      })
    } else {
      setFormData({
        email: '',
        name: '',
        password: '',
        role: 'VIEWER',
        isActive: true
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      // Check if user has permission
      if (currentUser.role !== 'SAAS_ADMIN' && currentUser.role !== 'COMPANY_ADMIN') {
        throw new Error('Bu işlemi yapmak için yetkiniz bulunmamaktadır')
      }

      const userRole = currentUser.role
      const userCompanyId = currentUser.companyId

      if (user) {
        // Update existing user
        const updateData: UserUpdateInput = {
          email: formData.email,
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive
        }

        // COMPANY_ADMIN can only update users from their company
        if (userRole === 'COMPANY_ADMIN' && user.companyId !== userCompanyId) {
          throw new Error('Bu kullanıcıyı güncelleme yetkiniz yok')
        }

        const response = await userService.update(user.id, updateData)

        if (response.error) {
          throw new Error(response.error)
        } else {
          // Promise toast kullan
          toast.promise(
            // 1 saniye gecikme ekle
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
              loading: 'Kullanıcı güncelleniyor...',
              success: 'Başarılı! Kullanıcı başarıyla güncellendi.',
              error: 'Bir hata oluştu.'
            }
          )

          // Kullanıcı güncellendiğinde callback'i çağır
          if (onUserUpdated) {
            onUserUpdated()
          }
        }
      } else {
        // Create new user
        // COMPANY_ADMIN can only add users to their company
        if (userRole === 'COMPANY_ADMIN') {
          formData.companyId = userCompanyId
        }

        const response = await userService.create(formData)

        if (response.error) {
          throw new Error(response.error)
        } else {
          // Promise toast kullan
          toast.promise(
            // 1 saniye gecikme ekle
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
              loading: 'Yeni kullanıcı oluşturuluyor...',
              success: 'Başarılı! Kullanıcı başarıyla oluşturuldu.',
              error: 'Bir hata oluştu.'
            }
          )

          // Yeni kullanıcı oluşturulduğunda callback'i çağır
          if (onUserCreated) {
            onUserCreated()
          }
        }
      }

      onClose()
    } catch (err) {
      console.error('Error saving user:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as User['role'] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roller</SelectLabel>
                  <SelectItem value="SAAS_ADMIN">SaaS Admin</SelectItem>
                  <SelectItem value="COMPANY_ADMIN">Şirket Admin</SelectItem>
                  <SelectItem value="MODERATOR">Moderatör</SelectItem>
                  <SelectItem value="VIEWER">Görüntüleyici</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Aktif</Label>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}