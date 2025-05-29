"use client"

import { cn } from "@/lib/utils"
import {
  ClipboardCheck,
  Home,
  Leaf,
  LogOut,
  Package,
  QrCode,
  ShieldCheck,
  User,
  Search
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {jwtDecode} from "jwt-decode"
import { useEffect, useState } from "react"

interface SidebarProps {
  className?: string
}

export interface DecodedToken {
  id: string
  role: "manufacturer" | "officer" | "customer"
  username?: string
  email: string
  exp?: number
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUser(decoded)
      } catch (err) {
        console.error("Invalid token:", err)
        localStorage.removeItem("token")
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const manufacturerLinks = [
    { href: "/manufacturer", label: "Dashboard", icon: Home },
    { href: "/manufacturer/new-batch", label: "New Batch", icon: Package },
    { href: "/manufacturer/credentials", label: "Credentials", icon: QrCode },
    { href: "/manufacturer/ingerdent-credentials", label: "Ingredient Credentials", icon: QrCode },
  ]

  const officerLinks = [
    { href: "/officer", label: "Dashboard", icon: Home },
    { href: "/officer/requests", label: "Batch Requests", icon: ClipboardCheck },
    // { href: "/officer/standards", label: "Safety Standards", icon: ShieldCheck },
  ]

  const customerLinks = [
    { href: "/customer", label: "Verify Products", icon: Search },
    { href: "/customer/history", label: "Verification History", icon: ClipboardCheck },
  ]

  const links =
    user?.role === "manufacturer"
      ? manufacturerLinks
      : user?.role === "officer"
      ? officerLinks
      : customerLinks

  return (
    <div className={cn("flex flex-col h-full bg-emerald-50 border-r border-emerald-100", className)}>
      <div className="p-4 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <h2 className="font-semibold text-emerald-800">Agri-Food Passport</h2>
        </div>
      </div>
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-emerald-200 text-emerald-900" : "text-emerald-700 hover:bg-emerald-100",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-emerald-100">
        {user && (
          <Link href={"/manufacturer/profile"} className="flex items-center gap-2 mb-3 px-3 py-2">
            <User className="h-5 w-5 text-emerald-600" />
            <div className="text-sm">
              <p className="font-medium text-emerald-800">{user.username || "User"}</p>
              <p className="text-xs text-emerald-600">{user.email}</p>
              <p className="text-xs text-emerald-500 capitalize">{user.role}</p>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
