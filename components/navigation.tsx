"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, BarChart, Home } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/insights", label: "Insights", icon: BarChart },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-secondary p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">DW Cycle Tracker</h1>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-secondary-foreground hover:bg-secondary-foreground/10",
                pathname === item.href ? "bg-secondary-foreground/20" : "",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

