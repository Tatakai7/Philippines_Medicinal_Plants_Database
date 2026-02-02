"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    // Check if admin is logged in by checking for token
    const token = localStorage.getItem("admin_token")
    setIsAdminLoggedIn(!!token)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isAdminLoggedIn ? (
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                  🌿
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                  🌿
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-8">
            {!isAdminLoggedIn ? (
              <>
                <Link href="/browse" className="text-foreground hover:text-primary transition">
                  Browse Plants
                </Link>
                <Link href="/search" className="text-foreground hover:text-primary transition">
                  Search
                </Link>
                <Link href="/categories" className="text-foreground hover:text-primary transition">
                  Categories
                </Link>
              </>
            ) : (
              <>
                <span className="text-muted-foreground cursor-not-allowed opacity-50">
                  Browse Plants
                </span>
                <span className="text-muted-foreground cursor-not-allowed opacity-50">
                  Search
                </span>
                <span className="text-muted-foreground cursor-not-allowed opacity-50">
                  Categories
                </span>
              </>
            )}
          </div>

          <Link href="/admin/login">
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              Admin
            </Button>
          </Link>


        </div>
      </div>
    </nav>
  )
}
