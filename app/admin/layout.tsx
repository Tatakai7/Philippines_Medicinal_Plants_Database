"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const router = useRouter()

  return <>{children}</>
}
