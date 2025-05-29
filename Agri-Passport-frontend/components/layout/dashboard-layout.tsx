"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {jwtDecode} from "jwt-decode"
import { Sidebar } from "./sidebar"

interface DecodedToken {
  id: string
  role: "manufacturer" | "officer" | "customer"
  iat?: number
  exp?: number
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<DecodedToken["role"] | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setRole(decoded.role)
      setIsAuthenticated(true)

      const pathname = window.location.pathname

      if (decoded.role === "manufacturer" && !pathname.startsWith("/manufacturer")) {
        router.push("/manufacturer")
      } else if (decoded.role === "officer" && !pathname.startsWith("/officer")) {
        router.push("/officer")
      } else if (decoded.role === "customer" && !pathname.startsWith("/customer")) {
        router.push("/customer")
      }

    } catch (err) {
      console.error("Invalid token", err)
      localStorage.removeItem("token")
      router.push("/login")
    }
  }, [router])

  if (!isAuthenticated || !role) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="w-64 hidden md:block" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
