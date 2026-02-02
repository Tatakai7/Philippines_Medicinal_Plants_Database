"use client"

import dynamic from "next/dynamic"
import Navigation from "@/components/navigation"
import InfoSectionSkeleton from "@/components/skeletons/info-section-skeleton"

// Lazy load category content
const CategoriesContent = dynamic(() => import("@/components/categories-content"), {
  loading: () => <InfoSectionSkeleton />,
  ssr: true,
})

export default function CategoriesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Medicinal Plant Categories</h1>
          <p className="text-muted-foreground mb-12">
            Browse medicinal plants by their therapeutic properties and uses
          </p>

          {/* Lazy-loaded categories with dynamic import */}
          <CategoriesContent />
        </div>
      </main>
    </>
  )
}
