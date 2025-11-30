import { Card } from "@/components/ui/card"

export default function InfoSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
            <div className="h-5 bg-muted rounded-lg animate-pulse w-24" />
            <div className="h-3 bg-muted rounded-lg animate-pulse w-full" />
            <div className="h-3 bg-muted rounded-lg animate-pulse w-5/6" />
          </div>
        </Card>
      ))}
    </div>
  )
}
