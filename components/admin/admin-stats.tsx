"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Stats {
  totalPlants: number
  totalCategories: number
  totalUses: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalPlants: 0,
    totalCategories: 0,
    totalUses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/plants")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const plants = await res.json()

      if (!Array.isArray(plants)) {
        throw new Error("Invalid response: plants is not an array")
      }

      const uniqueCategories = new Set<string>()
      const uniqueUses = new Set<string>()

      plants.forEach((plant: any) => {
        plant.category.forEach((cat: string) => uniqueCategories.add(cat))
        plant.uses.forEach((use: string) => uniqueUses.add(use))
      })

      setStats({
        totalPlants: plants.length,
        totalCategories: uniqueCategories.size,
        totalUses: uniqueUses.size,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
    setLoading(false)
  }

  const statCards = [
    {
      title: "Total Plants",
      value: stats.totalPlants,
      icon: "🌿",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: "🏷️",
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Medicinal Uses",
      value: stats.totalUses,
      icon: "💊",
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-foreground">{loading ? "..." : card.value}</p>
              </div>
              <div className={`text-2xl w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-secondary/20 border-primary/20">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Start</h2>
        <ul className="space-y-2 text-foreground">
          <li>
            ✓ Use the <span className="font-semibold">Manage Plants</span> section to add, edit, or delete plants
          </li>
          <li>✓ Add comprehensive information including uses, compounds, and preparation methods</li>
          <li>✓ All changes are reflected immediately on the public database</li>
          <li>✓ Each plant entry is searchable and browsable by visitors</li>
        </ul>
      </Card>
    </div>
  )
}
