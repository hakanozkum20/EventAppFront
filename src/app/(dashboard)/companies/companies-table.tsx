'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon, MoreHorizontalIcon, CheckIcon, XIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Company } from '@/services/company-service'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface CompaniesTableProps {
  companies: Company[]
  loading: boolean
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
  // Pagination props
  currentPage?: number
  pageSize?: number
  totalCount?: number
  pageCount?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function CompaniesTable({
  companies,
  loading,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
  totalCount = 0,
  pageCount = 0,
  onPageChange,
  onPageSizeChange
}: CompaniesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // Yerel pagination state'i yerine prop'ları kullan
  const pagination = {
    pageIndex: currentPage - 1, // 0-indexed
    pageSize: pageSize,
  }

  // Pagination değişikliğini işle
  const handlePaginationChange = (updaterOrValue: any) => {
    // Updater bir fonksiyon olabilir veya doğrudan bir değer olabilir
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(pagination)
      : updaterOrValue

    // Sayfa değiştiğinde onPageChange callback'ini çağır
    if (newPagination.pageIndex !== pagination.pageIndex && onPageChange) {
      onPageChange(newPagination.pageIndex + 1) // 1-indexed
    }

    // Sayfa boyutu değiştiğinde onPageSizeChange callback'ini çağır
    if (newPagination.pageSize !== pagination.pageSize && onPageSizeChange) {
      onPageSizeChange(newPagination.pageSize)
    }
  }

  // Silme işlemi için onay
  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company)
    setDeleteDialogOpen(true)
  }

  // Silme işlemini onayla
  const confirmDelete = () => {
    if (companyToDelete) {
      onDelete(companyToDelete)
      setCompanyToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // Tablo sütunları
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
      header: 'Şirket Adı',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'customerId',
      header: 'Müşteri ID',
      cell: ({ row }) => <div>{row.getValue('customerId') || '-'}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'Durum',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? (
              <><CheckIcon className="h-3 w-3 mr-1" /> Aktif</>
            ) : (
              <><XIcon className="h-3 w-3 mr-1" /> Pasif</>
            )}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const company = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü Aç</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(company)}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(company)}
                className="text-red-600 focus:text-red-600"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: handlePaginationChange,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Şirket adına göre ara..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalCount} kayıttan{' '}
          {currentPage * pageSize - pageSize + 1}-
          {Math.min(
            currentPage * pageSize,
            totalCount
          )}{' '}
          arası gösteriliyor.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Sayfa başına</p>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange && onPageSizeChange(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 ||
                         page === pageCount ||
                         Math.abs(page - currentPage) <= 1;
                })
                .map((page, i, array) => {
                  // Add ellipsis
                  if (i > 0 && array[i - 1] !== page - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => onPageChange && onPageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  className={currentPage >= pageCount ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Şirketi silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu şirket ve ilişkili tüm veriler kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
