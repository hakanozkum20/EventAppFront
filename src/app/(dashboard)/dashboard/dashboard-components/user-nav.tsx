'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
// Geçici olarak auth servislerini devre dışı bırakıyoruz
// import authService from "@/services/auth-service"
// import userService from "@/services/user-service"

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  // Geçici olarak router'i devre dışı bırakıyoruz
  // const router = useRouter()

  useEffect(() => {
    // Geçici olarak sabit bir kullanıcı oluşturuyoruz
    setUser({
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'SAAS_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Geçici olarak auth kontrolünü devre dışı bırakıyoruz
    // const getUser = async () => {
    //   // Token kontrolü
    //   if (!authService.isAuthenticated()) {
    //     return;
    //   }
    //
    //   // Kullanıcı bilgilerini al
    //   const response = await userService.getCurrentUser();
    //   if (response.data) {
    //     setUser(response.data);
    //   }
    // }
    //
    // getUser();
  }, [])

  const handleLogout = async () => {
    // Geçici olarak logout işlemini devre dışı bırakıyoruz
    // await authService.logout();
    // router.push('/login');
    console.log('Logout clicked');
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:bg-primary/5 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 hover-lift">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Avatar className="h-10 w-10 border-2 border-primary/20 bg-gradient-to-br from-background to-background/80 p-0.5">
            <AvatarImage src="/avatars/01.png" alt={user.name || user.email} className="rounded-full" />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-medium rounded-full">
              {(user.name || user.email)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0 overflow-hidden border border-primary/10 shadow-xl" align="end" forceMount>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 gradient-animate"></div>
          <div className="relative">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20 bg-gradient-to-br from-background to-background/80 p-0.5 shadow-md">
                <AvatarImage src="/avatars/01.png" alt={user.name || user.email} className="rounded-full" />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-medium rounded-full">
                  {(user.name || user.email)[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold leading-none mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{user.name || 'Kullanıcı'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {user.role === 'SAAS_ADMIN' ? 'Admin' : 'Kullanıcı'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 bg-background">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5 rounded-md p-2 my-1 transition-colors">
              <span className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Profil</p>
                  <p className="text-xs text-muted-foreground">Hesap bilgilerinizi yönetin</p>
                </div>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5 rounded-md p-2 my-1 transition-colors">
              <span className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Ayarlar</p>
                  <p className="text-xs text-muted-foreground">Tercihlerinizi özelleştirin</p>
                </div>
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-2 bg-primary/10" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-md p-2 my-1 transition-colors">
            <span className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Çıkış Yap</p>
                <p className="text-xs text-muted-foreground">Hesabınızdan güvenli çıkış yapın</p>
              </div>
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}