"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Role = "manufacturer" | "officer" | "customer" | null

interface User {
  id: string
  username: string
  email: string
  role: Role
}

interface AuthContextType {
  user: User | null
  role: Role
  isAuthenticated: boolean
  login: (role: string, email?: string, password?: string) => void
  register: (username: string, email: string, password: string, role: "manufacturer" | "customer") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>(null)

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setRole(parsedUser.role)
    }
  }, [])

  const login = (userRole: string, email?: string, password?: string) => {
    if (userRole === "manufacturer" || userRole === "officer" || userRole === "customer") {
      // In a real app, we would validate credentials against a database
      // Check if this user exists in localStorage (for demo purposes)
      const storedUserKey = `user_${email}`
      const storedUser = localStorage.getItem(storedUserKey)

      let newUser: User

      if (storedUser) {
        // If user exists, use their stored data but update the role
        const parsedUser = JSON.parse(storedUser)
        newUser = {
          ...parsedUser,
          role: userRole as Role,
        }
      } else {
        // If user doesn't exist (demo mode), create a new one
        newUser = {
          id: Math.random().toString(36).substring(2, 9),
          username: email ? email.split("@")[0] : `user-${Math.floor(Math.random() * 1000)}`,
          email: email || `user-${Math.floor(Math.random() * 1000)}@example.com`,
          role: userRole as Role,
        }
      }

      setUser(newUser)
      setRole(userRole as Role)

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser))
    }
  }

  const register = (username: string, email: string, password: string, role: "manufacturer" | "customer") => {
    // In a real app, we would store this in a database
    // For now, we'll just create a user object
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      email,
      role,
    }

    // Store in localStorage for demo purposes
    localStorage.setItem(
      `user_${email}`,
      JSON.stringify({
        ...newUser,
        password, // In a real app, this would be hashed
      }),
    )

    return newUser
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: role !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
