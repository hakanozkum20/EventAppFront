'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CompaniesTable } from './companies-table'
import { CompanyDialog } from './company-dialog'
import { Company } from '@/services/company-service'
import companyService from '@/services/company-service'
import { toast } from 'sonner'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  // Şirketleri yükle
  const loadCompanies = async () => {
    setLoading(true)
    try {
      const response = await companyService.getAll()
      if (response.data) {
        setCompanies(response.data)
      } else if (response.error) {
        toast.error('Hata', {
          description: response.error
        })
      }
    } catch (error) {
      toast.error('Hata', {
        description: 'Şirketler yüklenirken bir hata oluştu.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Sayfa yüklendiğinde şirketleri getir
  useEffect(() => {
    loadCompanies()
  }, [])

  // Şirket düzenleme işlemi
  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setDialogOpen(true)
  }

  // Şirket silme işlemi
  const handleDelete = async (company: Company) => {
    try {
      const response = await companyService.delete(company.id)
      if (response.error) {
        toast.error('Hata', {
          description: response.error
        })
      } else {
        toast.success('Başarılı', {
          description: 'Şirket başarıyla silindi.'
        })
        loadCompanies()
      }
    } catch (error) {
      toast.error('Hata', {
        description: 'Şirket silinirken bir hata oluştu.'
      })
    }
  }

  // Dialog kapatıldığında
  const handleDialogClose = () => {
    setSelectedCompany(null)
    setDialogOpen(false)
    loadCompanies()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Şirketler</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Şirket
        </Button>
      </div>

      <CompaniesTable
        companies={companies}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onClose={handleDialogClose}
        company={selectedCompany}
      />
    </div>
  )
}
