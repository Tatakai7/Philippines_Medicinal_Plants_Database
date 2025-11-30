"use client"

import { useEffect, useState, Suspense } from "react"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InfoSectionSkeleton from "@/components/skeletons/info-section-skeleton"

interface CategoryInfo {
  name: string
  count: number
  icon: string
}

function CategoriesContent() {
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
    return <InfoSectionSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.name} href={`/browse?category=${encodeURIComponent(category.name)}`}>
          <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{category.name}</h3>
            <p className="text-muted-foreground mb-4">
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

export default function CategoriesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Medicinal Plant Categories</h1>
          <p className="text-muted-foreground mb-12">
            Browse medicinal plants by their therapeutic properties and uses
          </p>

          <Suspense fallback={<InfoSectionSkeleton />}>
            <CategoriesContent />
          </Suspense>
        </div>
      </main>
    </>
  )
}
