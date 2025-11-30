import { Card } from "@/components/ui/card"

export default function AdminStatsSkeleton() {
  return (
    <div>
      <div className="h-8 bg-muted rounded-lg animate-pulse w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-lg animate-pulse w-20" />
              <div className="h-8 bg-muted rounded-lg animate-pulse w-16" />
              <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
