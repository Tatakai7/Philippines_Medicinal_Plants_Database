"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import Navigation from "@/components/navigation"
import FeaturedSectionSkeleton from "@/components/skeletons/featured-section-skeleton"
import InfoSectionSkeleton from "@/components/skeletons/info-section-skeleton"

// Lazy load heavy components
const FeaturedPlants = dynamic(() => import("@/components/featured-plants"), {
  loading: () => <FeaturedSectionSkeleton />,
  ssr: true,
})

const InfoSection = dynamic(() => import("@/components/info-section"), {
  loading: () => <InfoSectionSkeleton />,
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

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary to-secondary py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-pretty">
                Philippine Medicinal Plants Database
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 text-balance">
                Explore traditional healing knowledge and scientific information about the rich botanical heritage of
                the Philippines
              </p>
            </div>

            <SearchBar onSearch={() => {}} />
          </div>
        </section>

        {/* Browse Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">Featured Plants</h2>
                <p className="text-muted-foreground">
                  Discover the most commonly used medicinal plants in Philippine traditional medicine
                </p>
              </div>
              <Link href="/browse">
                <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                  View All Plants
                </Button>
              </Link>
            </div>

            {/* Lazy-loaded featured plants with dynamic import */}
            <FeaturedPlants />

            <div className="flex justify-center sm:hidden mt-8">
              <Link href="/browse">
                <Button className="bg-primary hover:bg-primary/90">View All Plants</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center text-balance">
              Why Explore Philippine Medicinal Plants?
            </h2>

            {/* Lazy-loaded info section with dynamic import */}
            <InfoSection />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary/5 py-12 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Database</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>
                    <Link href="/browse" className="hover:text-primary transition">
                      Browse Plants
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-primary transition">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="hover:text-primary transition">
                      Advanced Search
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Information</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Research
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Contributors
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Help & FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Disclaimer
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Connect</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-center text-muted-foreground text-sm">
                © 2025 Philippine Medicinal Plants Database. Preserving traditional Filipino healing knowledge.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
