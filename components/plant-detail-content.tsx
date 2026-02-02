"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

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

export default function PlantDetailContent({ plant }: { plant: Plant }) {
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
