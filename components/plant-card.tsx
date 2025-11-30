"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Plant {
  _id: string
  name: string
  scientificName: string
  tagalogName: string
  category: string[]
  uses: string[]
  description: string
  image: string
}

interface PlantCardProps {
  plant: Plant
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link href={`/plants/${plant._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
        <div className="relative w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
          {plant.image && plant.image !== "N/A" ? (
            <img
              src={plant.image || "/placeholder.svg"}
              alt={plant.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/medicinal-plant.jpg"
              }}
            />
          ) : (
            <div className="text-4xl">🌿</div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground truncate mb-1">{plant.name}</h3>
          <p className="text-sm text-primary italic mb-3">{plant.scientificName}</p>

          {plant.tagalogName && (
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-semibold">Tagalog:</span> {plant.tagalogName}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {plant.category &&
              plant.category.slice(0, 2).map((cat, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{plant.description}</p>
        </div>
      </Card>
    </Link>
  )
}
