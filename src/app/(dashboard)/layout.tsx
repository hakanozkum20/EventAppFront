'use client'

// NavigationMenu kullanılmıyor
import { Sidebar } from "./dashboard/dashboard-components/sidebar"
import { TopNav } from "./dashboard/dashboard-components/top-nav"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-muted/5 to-muted/20 dark:from-background dark:to-background/80">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute left-4 top-4 z-50 rounded-full hover:bg-primary/10 transition-all hover-lift shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] border-r shadow-xl">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="container p-4 md:p-6 space-y-6 flex-1">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl shadow-md border border-primary/5 p-6 transition-colors duration-300">
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  )
}