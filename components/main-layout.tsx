"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, BarChart3, Home, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="fixed top-4 left-4 z-50 md:hidden">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-md md:translate-x-0 md:static md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center py-6">
            <Logo />
          </div>
          <nav className="flex-1 mt-8 space-y-2">
            <NavItem icon={<Home size={20} />} label="Dashboard" isActive />
            <NavItem icon={<Calendar size={20} />} label="Calendar" />
            <NavItem icon={<BarChart3 size={20} />} label="Insights" />
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </nav>
          <div className="mt-auto pb-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blush-light to-lavender">
              <h3 className="font-medium text-sm text-primary-foreground">Premium Features</h3>
              <p className="text-xs mt-1 text-primary-foreground/80">
                Unlock advanced insights and personalized recommendations
              </p>
              <Button className="mt-3 w-full bg-white text-primary hover:bg-white/90">Upgrade</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 px-3 py-6 h-auto rounded-xl",
        isActive ? "bg-sage-light text-secondary-foreground" : "text-muted-foreground",
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Button>
  )
}

