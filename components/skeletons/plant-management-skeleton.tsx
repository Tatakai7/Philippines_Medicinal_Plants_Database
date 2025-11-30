export default function PlantManagementSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 bg-muted rounded-lg animate-pulse w-48" />
        <div className="h-10 bg-muted rounded-lg animate-pulse w-32" />
      </div>
      <div className="mb-8 h-10 bg-muted rounded-lg animate-pulse w-64" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
