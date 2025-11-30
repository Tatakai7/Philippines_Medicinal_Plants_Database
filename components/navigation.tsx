"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              🌿
            </div>
            <span className="font-bold text-lg hidden sm:inline text-foreground">Hilot Database</span>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link href="/browse" className="text-foreground hover:text-primary transition">
              Browse Plants
            </Link>
            <Link href="/search" className="text-foreground hover:text-primary transition">
              Search
            </Link>
            <Link href="/categories" className="text-foreground hover:text-primary transition">
              Categories
            </Link>
          </div>

          <Link href="/admin">
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
