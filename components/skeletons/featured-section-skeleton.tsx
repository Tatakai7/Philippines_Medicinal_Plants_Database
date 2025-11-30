import PlantCardSkeleton from "./plant-card-skeleton"

export default function FeaturedSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <PlantCardSkeleton key={i} />
      ))}
    </div>
  )
}
