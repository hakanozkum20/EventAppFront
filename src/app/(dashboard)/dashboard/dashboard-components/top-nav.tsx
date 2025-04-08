'use client'

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "./user-nav"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full glass dark:glass-dark border-b border-primary/5 shadow-md">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="hidden md:flex md:flex-1">
          <form className="flex-1 md:max-w-sm lg:max-w-lg">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-200" />
                <Input
                  placeholder="Ara..."
                  className="pl-10 pr-4 py-2 bg-background/50 dark:bg-background/30 border-primary/10 focus-visible:ring-primary/30 rounded-full h-10 transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover-lift">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs rounded-full pulse">3</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover-lift md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover-lift">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <div className={cn(
              "h-6 w-px bg-primary/10 mx-2",
            )} />
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}