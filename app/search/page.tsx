"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense, lazy } from "react"
import dynamic from "next/dynamic"
import Navigation from "@/components/navigation"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import FeaturedSectionSkeleton from "@/components/skeletons/featured-section-skeleton"

// Lazy load PlantCard component
const PlantCard = dynamic(() => import("@/components/plant-card"), {
  loading: () => <div className="bg-muted animate-pulse h-64 rounded-lg" />,
  ssr: true,
})

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

function SearchResults({ results }: { results: Plant[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((plant) => (
        <Suspense key={plant._id} fallback={<div className="bg-muted animate-pulse h-64 rounded-lg" />}>
          <PlantCard plant={plant} />
        </Suspense>
      ))}
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"name" | "uses" | "all">("all")

  useEffect(() => {
    performSearch()
  }, [query, filter])

  const performSearch = async () => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}`)
      if (!res.ok) {
        console.error("Search failed:", res.statusText)
        setResults([])
        setLoading(false)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setResults(data)
      } else {
        console.error("Invalid data format:", data)
        setResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="bg-secondary/20 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {query && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Search Results</h1>
                <p className="text-muted-foreground">
                  {loading
                    ? "Searching..."
                    : `Found ${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
                </p>
              </div>

              {/* Search Filters */}
              <div className="mb-8 flex gap-2">
                {(["all", "name", "uses"] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f)}
                    className={filter === f ? "bg-primary hover:bg-primary/90" : ""}
                    size="sm"
                  >
                    {f === "all" ? "All Fields" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>

              {loading ? (
                <FeaturedSectionSkeleton />
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">No results found</p>
                  <p className="text-muted-foreground">Try different search terms or browse all plants</p>
                </div>
              ) : (
                /* Lazy-loaded search results with per-item Suspense */
                <SearchResults results={results} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
