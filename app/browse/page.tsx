"use client"

import { useEffect, useState, Suspense } from "react"
import Navigation from "@/components/navigation"
import PlantCard from "@/components/plant-card"
import { Button } from "@/components/ui/button"
import FeaturedSectionSkeleton from "@/components/skeletons/featured-section-skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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

function PlantsGrid({ plants }: { plants: Plant[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => (
        <PlantCard key={plant._id} plant={plant} />
      ))}
    </div>
  )
}

export default function BrowsePage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      const res = await fetch("/api/plants")
      const data = await res.json() as Plant[]
      setPlants(data)
      setFilteredPlants(data)

      // Extract unique categories
      const uniqueCategories = [...new Set(data.flatMap((p: Plant) => p.category))]
      setCategories(uniqueCategories)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching plants:", error)
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPlants(plants.filter((plant) => plant.category.includes(selectedCategory)))
    } else {
      setFilteredPlants(plants)
    }
  }, [selectedCategory, plants])

  const paginatedPlants = filteredPlants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage)

  return (
    <SidebarProvider>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Browse Medicinal Plants</h1>
            <p className="text-muted-foreground mb-8">
              Explore {filteredPlants.length} plants in our comprehensive database
            </p>

            {/* Categories Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  onClick={() => handleCategoryFilter("")}
                  className={selectedCategory === "" ? "bg-primary hover:bg-primary/90" : ""}
                >
                  All Plants
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategoryFilter(category)}
                    className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Plants Grid */}
          {loading ? (
            <FeaturedSectionSkeleton />
          ) : filteredPlants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No plants found</p>
            </div>
          ) : (
            <>
              <Suspense fallback={<FeaturedSectionSkeleton />}>
                <PlantsGrid plants={paginatedPlants} />
              </Suspense>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 flex-wrap mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? "bg-primary hover:bg-primary/90" : ""}
                      size="sm"
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader>
          <h3 className="font-semibold text-foreground">Filter by Category</h3>
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-2 p-4">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => handleCategoryFilter("")}
              className={`w-full justify-start ${selectedCategory === "" ? "bg-primary hover:bg-primary/90" : ""}`}
            >
              All Plants
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => handleCategoryFilter(category)}
                className={`w-full justify-start ${selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}`}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
