"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CategoryInfo {
  name: string
  count: number
  icon: string
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/plants")
      const plants = await res.json()

      const categoryMap = new Map<string, number>()
      plants.forEach((plant: any) => {
        plant.category.forEach((cat: string) => {
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
        })
      })

      const categoryEmojis: { [key: string]: string } = {
        Diuretic: "💧",
        Respiratory: "🫁",
        "Anti-inflammatory": "🔥",
        Digestive: "🍽️",
        Analgesic: "💪",
        "Skin Care": "✨",
        Laxative: "💊",
        Antioxidant: "⚡",
        "Anti-nausea": "🤢",
      }

      const sortedCategories = Array.from(categoryMap.entries())
        .map(([name, count]) => ({
          name,
          count,
          icon: categoryEmojis[name] || "🌿",
        }))
        .sort((a, b) => b.count - a.count)

      setCategories(sortedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted animate-pulse h-48 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.name} href={`/browse?category=${encodeURIComponent(category.name)}`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {category.count} plant{category.count !== 1 ? "s" : ""}
            </p>
            <Button variant="outline" size="sm">
              Explore
            </Button>
          </Card>
        </Link>
      ))}
    </div>
  )
}
