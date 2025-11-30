"use client"

import { useEffect, useState, Suspense } from "react"
import PlantCard from "./plant-card"
import FeaturedSectionSkeleton from "./skeletons/featured-section-skeleton"

interface Plant {
  _id: string
  name: string
  scientificName: string
  tagalogName: string
  family: string
  category: string[]
  uses: string[]
  description: string
  image: string
}

function FeaturedPlantsContent() {
  const [featured, setFeatured] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      const res = await fetch("/api/plants")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setFeatured(data.slice(0, 6))
      } else {
        console.error("Expected an array of plants, but received:", data)
        setFeatured([])
      }
    } catch (error) {
      console.error("Error fetching plants:", error)
      setFeatured([])
    }
    setLoading(false)
  }

  if (loading) {
    return <FeaturedSectionSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((plant) => (
        <PlantCard key={plant._id} plant={plant} />
      ))}
    </div>
  )
}

export default function FeaturedPlants() {
  return (
    <Suspense fallback={<FeaturedSectionSkeleton />}>
      <FeaturedPlantsContent />
    </Suspense>
  )
}
