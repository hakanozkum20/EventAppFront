'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Building2, Settings, ChevronRight, ChevronLeft, LayoutDashboard, CalendarDays } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Takvim",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "relative flex flex-col h-screen bg-background/95 backdrop-blur-sm border-r border-primary/10 transition-all duration-300 shadow-md",
      isCollapsed ? "w-[70px]" : "w-[280px]"
    )}>
      <div className="flex items-center justify-between p-4 h-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50 gradient-animate"></div>
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300 relative z-10",
          isCollapsed && "opacity-0"
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
            <Building2 className="h-7 w-7 text-primary relative" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Event Manager</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-7 h-8 w-8 rounded-full border border-primary/10 shadow-md bg-background hover:bg-primary/5 transition-all hover-lift z-20"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-primary" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-primary" />
          )}
        </Button>
      </div>
      <Separator className="opacity-30" />
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <nav className="grid gap-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={cn(
                  "group relative w-full transition-all duration-200",
                  isCollapsed ? "px-0" : "px-0"
                )}
              >
                {pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm opacity-70"></div>
                )}
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-all relative z-10 rounded-xl",
                    pathname === item.href ?
                      "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/95 hover:to-primary/85 shadow-md" :
                      "hover:bg-primary/5 text-muted-foreground hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-lg",
                    pathname === item.href ?
                      "bg-white/20 text-primary-foreground" :
                      "bg-primary/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "font-medium transition-all duration-300",
                    isCollapsed && "hidden"
                  )}>
                    {item.title}
                  </span>
                </Button>
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <Separator className="opacity-30" />
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-3 h-12 hover:bg-primary/5 hover:text-foreground border-primary/10 text-muted-foreground rounded-xl group transition-all hover-lift",
              isCollapsed && "justify-center px-2"
            )}
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <Settings className="h-5 w-5" />
            </div>
            <span className={cn(
              "font-medium transition-all duration-300",
              isCollapsed && "hidden"
            )}>
              Tercihler
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}