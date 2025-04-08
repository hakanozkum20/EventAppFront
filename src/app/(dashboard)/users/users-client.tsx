'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { UserDialog } from '@/components/users/UserDialog'
// Geçici olarak auth kontekstini devre dışı bırakıyoruz
// // Geçici olarak auth kontekstini devre dışı bırakıyoruz
// import { useAuth } from '@/contexts/auth-context'
import { getUsers } from '@/services/api'

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
  // const { user: currentUser } = useAuth()
  const currentUser = { role: 'SAAS_ADMIN', companyId: '1' } // Geçici olarak admin rolü veriyoruz
  const router = useRouter()

  useEffect(() => {
    // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
    // // Redirect if not authenticated
    // if (!currentUser) {
    //   router.push('/login')
    //   return
    // }
    //
    // // Check if user has permission
    // if (currentUser.role !== 'SAAS_ADMIN' && currentUser.role !== 'COMPANY_ADMIN') {
    //   setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.')
    //   return
    // }

    fetchUsers()
  }, [currentUser, router])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await getUsers()

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        setUsers(response.data)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Kullanıcılar getirilirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedUser(null)
    fetchUsers()
  }

  if (!currentUser) return null
  if (isLoading) return <div>Yükleniyor...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Son Giriş</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isActive ? 'Aktif' : 'Pasif'}</TableCell>
                <TableCell>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('tr-TR')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClose={handleDialogClose}
        user={selectedUser}
      />
    </div>
  )
}
