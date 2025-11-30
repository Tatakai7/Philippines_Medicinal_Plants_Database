"use client"

import React, { useEffect, useState, Suspense } from "react"
import Navigation from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Plant {
  _id: string
  name: string
  scientificName: string
  tagalogName: string
  family: string
  genus: string
  category: string[]
  uses: string[]
  description: string
  activeCompounds: string[]
  preparation: string[]
  precautions: string[]
  image: string
}

function PlantDetailContent({ plant }: { plant: Plant }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Image */}
        <div className="md:col-span-1">
          <div className="sticky top-20 rounded-lg overflow-hidden bg-muted h-64 md:h-96 flex items-center justify-center">
            {plant.image && plant.image !== "N/A" ? (
              <img
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/medicinal-plant.jpg"
                }}
              />
            ) : (
              <div className="text-6xl">🌿</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">{plant.name}</h1>

          <p className="text-xl text-primary italic mb-4">{plant.scientificName}</p>

          {plant.tagalogName && (
            <p className="text-lg text-muted-foreground mb-4">
              <span className="font-semibold">Tagalog Name:</span> {plant.tagalogName}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {plant.category.map((cat, i) => (
              <Badge key={i} className="bg-primary text-primary-foreground">
                {cat}
              </Badge>
            ))}
          </div>

          <Card className="p-6 bg-secondary/30 border-0 mb-6">
            <p className="text-foreground leading-relaxed">{plant.description}</p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {plant.family && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="font-semibold text-foreground">{plant.family}</p>
              </div>
            )}
            {plant.genus && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Genus</p>
                <p className="font-semibold text-foreground">{plant.genus}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uses Section */}
      {plant.uses && plant.uses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Traditional Uses</h2>
          <Card className="p-6">
            <ul className="space-y-3">
              {plant.uses.map((use, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-foreground">{use}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Active Compounds Section */}
      {plant.activeCompounds && plant.activeCompounds.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Active Compounds</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {plant.activeCompounds.map((compound, i) => (
                <Badge key={i} variant="outline" className="border-primary text-primary">
                  {compound}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Preparation Section */}
      {plant.preparation && plant.preparation.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Preparation Methods</h2>
          <Card className="p-6">
            <ul className="space-y-3">
              {plant.preparation.map((method, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent font-bold">→</span>
                  <span className="text-foreground">{method}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Precautions Section */}
      {plant.precautions && plant.precautions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Precautions & Warnings</h2>
          <Card className="p-6 border-destructive/30 bg-destructive/5">
            <ul className="space-y-3">
              {plant.precautions.map((precaution, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-destructive font-bold">⚠</span>
                  <span className="text-foreground">{precaution}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  )
}

function PlantDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
      <div className="h-8 bg-muted rounded-lg animate-pulse w-1/2" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded-lg animate-pulse w-full" />
        <div className="h-4 bg-muted rounded-lg animate-pulse w-5/6" />
      </div>
    </div>
  )
}

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlant()
  }, [resolvedParams.id])

  const fetchPlant = async () => {
    try {
      const res = await fetch(`/api/plants/${resolvedParams.id}`)
      const data = await res.json()
      setPlant(data)
    } catch (error) {
      console.error("Error fetching plant:", error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </>
    )
  }

  if (!plant) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Plant not found</p>
            <Link href="/browse">
              <Button className="bg-primary hover:bg-primary/90">Back to Browse</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-secondary/20 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/browse" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Browse
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<PlantDetailSkeleton />}>
            <PlantDetailContent plant={plant} />
          </Suspense>

          <div className="text-center py-8 border-t border-border">
            <p className="text-muted-foreground text-sm mb-6">
              Disclaimer: This information is for educational purposes only. Consult with healthcare professionals
              before using any medicinal plants.
            </p>
            <Link href="/browse">
              <Button variant="outline">Browse More Plants</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
