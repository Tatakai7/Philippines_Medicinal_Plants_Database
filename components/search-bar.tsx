"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      onSearch?.(query)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2 max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Search by plant name, scientific name, or uses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white/90 border-0 text-foreground placeholder:text-muted-foreground"
        />
        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
          Search
        </Button>
      </div>
    </form>
  )
}
