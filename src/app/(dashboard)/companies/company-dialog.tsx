'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
// import { Textarea } from '@/components/ui/textarea' // Kullanılmıyor
import { Company } from '@/services/company-service'
import companyService from '@/services/company-service'
import { toast } from 'sonner'
// Geçici olarak auth kontekstini devre dışı bırakıyoruz
// import { useAuth } from '@/contexts/auth-context'

interface CompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  company: Company | null
}

export function CompanyDialog({ open, onOpenChange, onClose, company }: CompanyDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Company tipini kullanarak form verilerini yönetiyoruz
  // Backend'e gönderirken sadece gerekli alanları seçeceğiz
  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    isActive: true // Frontend'de göstermek için kullanıyoruz
  })
  // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
  // const { user } = useAuth()
  const user = { role: 'SAAS_ADMIN' } // Geçici olarak admin rolü veriyoruz

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        customerId: company.customerId || '',
        isActive: company.isActive
      })
    } else {
      setFormData({
        name: '',
        customerId: '',
        isActive: true
      })
    }
  }, [company])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Form doğrulaması
      if (!formData.name || formData.name.trim() === '') {
        throw new Error('Şirket adı boş olamaz')
      }

      if (!user) {
        throw new Error('Oturum açmanız gerekiyor')
      }

      // Yetki kontrolü
      if (user.role !== 'SAAS_ADMIN' && user.role !== 'COMPANY_ADMIN') {
        throw new Error('Bu işlemi yapmak için yetkiniz bulunmamaktadır')
      }

      if (company) {
        // Mevcut şirketi güncelle
        // Backend'e sadece gerekli alanları gönderiyoruz
        // Backend'in beklediği format: { name: string, customerId: Guid | null }
        const updateData = {
          name: formData.name.trim(), // Boşlukları temizle
          // Boş string yerine null gönderiyoruz
          customerId: formData.customerId && formData.customerId.trim() !== '' ? formData.customerId : null
        }

        // Hata ayıklama için verileri konsola yazdır
        console.log('Update Data:', updateData);

        const response = await companyService.update(company.id, updateData)

        if (response.error) {
          throw new Error(response.error)
        } else {
          toast.success('Başarılı', {
            description: 'Şirket başarıyla güncellendi.'
          })
        }
      } else {
        // Yeni şirket oluştur
        // Backend'e sadece gerekli alanları gönderiyoruz
        // Backend'in beklediği format: { name: string, customerId: Guid | null }
        const createData = {
          name: formData.name.trim(), // Boşlukları temizle
          // Boş string yerine null gönderiyoruz
          customerId: formData.customerId && formData.customerId.trim() !== '' ? formData.customerId : null
        }

        // Hata ayıklama için verileri konsola yazdır
        console.log('Create Data:', createData);
        const response = await companyService.create(createData)

        if (response.error) {
          throw new Error(response.error)
        } else {
          toast.success('Başarılı', {
            description: 'Şirket başarıyla oluşturuldu.'
          })
        }
      }

      onClose()
    } catch (err) {
      console.error('Error saving company:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      toast.error('Hata', {
        description: err instanceof Error ? err.message : 'Bir hata oluştu'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {company ? 'Şirket Düzenle' : 'Yeni Şirket'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Şirket Adı</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerId">Müşteri ID</Label>
            <Input
              id="customerId"
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              placeholder="Müşteri ID (opsiyonel)"
            />
          </div>

          {/* Backend'de olmadığı için email, phone ve address alanlarını kaldırdık */}

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
