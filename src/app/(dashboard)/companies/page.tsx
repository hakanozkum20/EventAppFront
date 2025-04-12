'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { CompaniesTable } from './companies-table'
import { CompanyDialog } from './company-dialog'
import { Company } from '@/services/company-service'
import companyService from '@/services/company-service'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { PaginatedResponse } from '@/types/pagination'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  // Şirketleri yükle
  const loadCompanies = async () => {
    setLoading(true)
    try {
      // Pagination parametreleri ile şirketleri getir
      const response = await companyService.getPaginated({ page: currentPage, size: pageSize })

      if (response.data) {
        // Pagination bilgilerini güncelle
        setCompanies(response.data.items)
        setTotalCount(response.data.totalCount)
        setPageCount(response.data.pageCount)
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

  // Sayfa, sayfa numarası veya sayfa boyutu değiştiğinde şirketleri getir
  useEffect(() => {
    loadCompanies()
  }, [currentPage, pageSize])

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
    // loadCompanies()
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
        // Pagination props
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        pageCount={pageCount}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1) // Sayfa boyutu değiştiğinde ilk sayfaya dön
        }}
      />

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            // Dialog kapandığında handleDialogClose fonksiyonunu çağır
            handleDialogClose()
          }
        }}
        onClose={handleDialogClose}
        company={selectedCompany}
        onCompanyCreated={loadCompanies} // Yeni şirket oluşturulduğunda şirketleri yeniden yükle
        onCompanyUpdated={loadCompanies} // Şirket güncellendiğinde şirketleri yeniden yükle
      />

      <Toaster />
    </div>
  )
}
