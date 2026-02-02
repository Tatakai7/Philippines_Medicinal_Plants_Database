"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthSession {
  username: string
  email: string
  iat?: number
  exp?: number
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is on login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true)
      return
    }

    // Check for auth token
    const token = localStorage.getItem("admin_token")
    
    if (!token) {
      setIsAuthenticated(false)
      router.push("/admin/login")
      return
    }

    try {
      // Decode and validate token
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8")) as AuthSession
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("admin_token")
        setIsAuthenticated(false)
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Token validation error:", error)
      localStorage.removeItem("admin_token")
      setIsAuthenticated(false)
      router.push("/admin/login")
    }
  }, [pathname, router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
