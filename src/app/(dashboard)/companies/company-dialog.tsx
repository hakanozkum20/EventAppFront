'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Company } from '@/services/company-service'
import companyService from '@/services/company-service'
import { toast } from 'sonner'
// Geçici olarak auth kontekstini devre dışı bırakıyoruz
// import { useAuth } from '@/contexts/auth-context'

// Form şeması
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Şirket adı en az 2 karakter olmalıdır.",
  }),
  customerId: z.string().optional(),
  isActive: z.boolean().default(true),
})

// Form tipi - z.infer<typeof formSchema> kullanıyoruz

interface CompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  company: Company | null
  onCompanyCreated?: () => void // Yeni şirket oluşturulduğunda çağrılacak fonksiyon
  onCompanyUpdated?: () => void // Şirket güncellendiğinde çağrılacak fonksiyon
}

export function CompanyDialog({ open, onOpenChange, onClose, company, onCompanyCreated, onCompanyUpdated }: CompanyDialogProps) {
  const [error, setError] = useState<string | null>(null)
  // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
  // const { user } = useAuth()
  const user = { role: 'SAAS_ADMIN' } // Geçici olarak admin rolü veriyoruz

  // Form tanımı
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      customerId: '',
      isActive: true
    }
  })

  // Form gönderme işlemi
  function onSubmit(values: any) {
    handleFormSubmit(values)
  }

  // Dialog açıldığında form verilerini güncelle
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        customerId: company.customerId || '',
        isActive: company.isActive
      })
    } else {
      form.reset({
        name: '',
        customerId: '',
        isActive: true
      })
    }
  }, [company, form])

  // Dialog kapandığında hata durumunu sıfırla
  useEffect(() => {
    if (!open) {
      setError(null)
    }
  }, [open])

  const handleFormSubmit = async (values: any) => {
    setError(null)

    try {
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
          name: values.name.trim(), // Boşlukları temizle
          // Boş string yerine null gönderiyoruz
          customerId: values.customerId && values.customerId.trim() !== '' ? values.customerId : null
        }

        // Hata ayıklama için verileri konsola yazdır
        console.log('Update Data:', updateData);

        const response = await companyService.update(company.id, updateData)

        if (response.error) {
          setError(response.error)
          return
        } else {
          // Promise toast kullan
          toast.promise(
            // 1 saniye gecikme ekle
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
              loading: 'Şirket güncelleniyor...',
              success: 'Başarılı! Şirket başarıyla güncellendi.',
              error: 'Bir hata oluştu.'
            }
          )
        }
      } else {
        // Yeni şirket oluştur
        // Backend'e sadece gerekli alanları gönderiyoruz
        // Backend'in beklediği format: { name: string, customerId: Guid | null }
        const createData = {
          name: values.name.trim(), // Boşlukları temizle
          // Boş string yerine null gönderiyoruz
          customerId: values.customerId && values.customerId.trim() !== '' ? values.customerId : null
        }

        // Hata ayıklama için verileri konsola yazdır
        console.log('Create Data:', createData);
        const response = await companyService.create(createData)

        if (response.error) {
          setError(response.error)
          return
        } else {
          // Promise toast kullan
          toast.promise(
            // 1 saniye gecikme ekle
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
              loading: 'Yeni şirket oluşturuluyor...',
              success: 'Başarılı! Şirket başarıyla oluşturuldu.',
              error: 'Bir hata oluştu.'
            }
          )
        }
      }

      // Başarılı işlem sonrası dialog'u kapat
      onClose()
      onOpenChange(false)

      // Şirket ekleme veya güncelleme işlemine göre ilgili callback'i çağır
      if (company) {
        // Şirket güncellendi
        if (onCompanyUpdated) {
          onCompanyUpdated()
        }
      } else {
        // Yeni şirket oluşturuldu
        if (onCompanyCreated) {
          onCompanyCreated()
        }
      }
    } catch (err) {
      console.error('Error saving company:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şirket Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Şirket adını girin" {...field} />
                  </FormControl>
                  <FormDescription>
                    Şirketin tam adını girin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Müşteri ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Müşteri ID (opsiyonel)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Varsa müşteri ID'sini girin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktif</FormLabel>
                    <FormDescription>
                      Şirketin aktif olup olmadığını belirtin.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 text-sm border border-red-200 rounded-md bg-red-50 text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )

}
