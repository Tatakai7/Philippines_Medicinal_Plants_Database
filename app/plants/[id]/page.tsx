"use client"

import React, { useEffect, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import Navigation from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import InfoSectionSkeleton from "@/components/skeletons/info-section-skeleton"

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

// Lazy load detail content
const PlantDetailContent = dynamic(() => import("@/components/plant-detail-content"), {
  loading: () => <InfoSectionSkeleton />,
  ssr: true,
})

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
          {/* Lazy-loaded detail content with dynamic import */}
          <PlantDetailContent plant={plant} />

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
