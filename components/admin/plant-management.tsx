"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import AddPlantModal from "./add-plant-modal"
import EditPlantModal from "./edit-plant-modal"
import type { Plant } from "@/lib/types"

export default function PlantManagement() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchPlants()
  }, [])

  useEffect(() => {
    const filtered = plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPlants(filtered)
  }, [searchTerm, plants])

  const fetchPlants = async () => {
    try {
      const res = await fetch("/api/plants")
      const data = await res.json()
      setPlants(data)
    } catch (error) {
      console.error("Error fetching plants:", error)
    }
    setLoading(false)
  }

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plant?")) {
      try {
        const response = await fetch(`/api/plants/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete plant")
        }

        setPlants(plants.filter((p) => p._id !== id))
      } catch (error) {
        console.error("Error deleting plant:", error)
        alert("Failed to delete plant")
      }
    }
  }

  const handleAddPlant = (newPlant: Plant) => {
    setPlants([...plants, newPlant])
    setShowAddModal(false)
  }

  const handleUpdatePlant = (updatedPlant: Plant) => {
    setPlants(plants.map((p) => (p._id === updatedPlant._id ? updatedPlant : p)))
    setShowEditModal(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Plants</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddModal(true)}>
          + Add New Plant
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <Input
          placeholder="Search plants by name or scientific name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Plants Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Card className="border-0">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Plant Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Scientific Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Category</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlants.map((plant) => (
                  <tr key={plant._id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="p-4 font-medium text-foreground">{plant.name}</td>
                    <td className="p-4 text-muted-foreground italic">{plant.scientificName}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {plant.category.slice(0, 2).map((cat, i) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                        {plant.category.length > 2 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            +{plant.category.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(plant)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(plant._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {filteredPlants.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No plants found</p>
            </Card>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddPlantModal onClose={() => setShowAddModal(false)} onAdd={handleAddPlant} />}

      {showEditModal && editingPlant && (
        <EditPlantModal
          plant={editingPlant}
          onClose={() => {
            setShowEditModal(false)
            setEditingPlant(null)
          }}
          onUpdate={handleUpdatePlant}
        />
      )}
    </div>
  )
}
