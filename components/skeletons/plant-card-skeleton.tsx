import { Card } from "@/components/ui/card"

export default function PlantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-48 bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded-lg animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded-lg animate-pulse w-1/2" />
        <div className="h-3 bg-muted rounded-lg animate-pulse w-full" />
        <div className="h-3 bg-muted rounded-lg animate-pulse w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-muted rounded-lg animate-pulse w-16" />
          <div className="h-6 bg-muted rounded-lg animate-pulse w-16" />
        </div>
      </div>
    </Card>
  )
}
