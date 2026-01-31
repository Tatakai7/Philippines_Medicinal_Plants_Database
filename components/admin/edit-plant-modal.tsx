"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Plant } from "@/lib/types"

interface EditPlantModalProps {
  plant: Plant
  onClose: () => void
  onUpdate: (plant: Plant) => void
}

export default function EditPlantModal({ plant, onClose, onUpdate }: EditPlantModalProps) {
  const [formData, setFormData] = useState({
    name: plant.name,
    scientificName: plant.scientificName,
    tagalogName: plant.tagalogName || "",
    family: plant.family || "",
    genus: plant.genus || "",
    description: plant.description,
    category: plant.category.join(", "),
    uses: plant.uses.join("\n"),
    activeCompounds: plant.activeCompounds.join(", "),
    preparation: plant.preparation.join("\n"),
    precautions: plant.precautions.join("\n"),
    image: plant.image || "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let imageUrl = formData.image

      // Upload image if file is selected
      if (imageFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.url
        setUploading(false)
      }

      const updatedPlant = {
        ...plant,
        name: formData.name,
        scientificName: formData.scientificName,
        tagalogName: formData.tagalogName,
        family: formData.family,
        genus: formData.genus,
        category: formData.category
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        uses: formData.uses
          .split("\n")
          .map((u) => u.trim())
          .filter((u) => u),
        description: formData.description,
        activeCompounds: formData.activeCompounds
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        preparation: formData.preparation
          .split("\n")
          .map((p) => p.trim())
          .filter((p) => p),
        precautions: formData.precautions
          .split("\n")
          .map((p) => p.trim())
          .filter((p) => p),
        image: imageUrl,
      }

      const response = await fetch(`/api/plants/${plant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlant),
      })

      if (!response.ok) {
        throw new Error("Failed to update plant")
      }

      const result = await response.json()
      onUpdate(result.data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error updating plant:", err)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Edit Plant</h2>

          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Plant Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sambong"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Scientific Name *</label>
                <Input
                  required
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  placeholder="e.g., Blumea balsamifera"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tagalog Name</label>
                <Input
                  value={formData.tagalogName}
                  onChange={(e) => setFormData({ ...formData, tagalogName: e.target.value })}
                  placeholder="e.g., Sambong"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Family</label>
                <Input
                  value={formData.family}
                  onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                  placeholder="e.g., Asteraceae"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Genus</label>
                <Input
                  value={formData.genus}
                  onChange={(e) => setFormData({ ...formData, genus: e.target.value })}
                  placeholder="e.g., Blumea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the plant..."
                className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categories (comma-separated)</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Diuretic, Respiratory"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Uses (one per line)</label>
              <textarea
                value={formData.uses}
                onChange={(e) => setFormData({ ...formData, uses: e.target.value })}
                placeholder="Treatment of kidney stones&#10;Relief of respiratory issues"
                className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Active Compounds (comma-separated)
              </label>
              <Input
                value={formData.activeCompounds}
                onChange={(e) => setFormData({ ...formData, activeCompounds: e.target.value })}
                placeholder="e.g., Essential oils, Flavonoids"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Preparation Methods (one per line)
              </label>
              <textarea
                value={formData.preparation}
                onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                placeholder="Decoction: Boil leaves in water&#10;Tea: Steep dried leaves"
                className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Precautions & Warnings (one per line)
              </label>
              <textarea
                value={formData.precautions}
                onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                placeholder="Not recommended for pregnant women&#10;May interact with medications"
                className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 flex-1">
                {loading ? "Updating..." : "Update Plant"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
