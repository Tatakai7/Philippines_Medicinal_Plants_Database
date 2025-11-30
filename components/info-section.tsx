import { Card } from "@/components/ui/card"

export default function InfoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🌿</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Traditional Wisdom</h3>
        <p className="text-muted-foreground">
          Centuries of Filipino healing practices and indigenous knowledge documented in one accessible database
        </p>
      </Card>

      <Card className="p-6">
        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🔬</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Scientific Research</h3>
        <p className="text-muted-foreground">
          Evidence-based information on active compounds, health benefits, and modern scientific validation
        </p>
      </Card>

      <Card className="p-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🌱</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Sustainability</h3>
        <p className="text-muted-foreground">
          Learn about sustainable harvesting and cultivation of medicinal plants for future generations
        </p>
      </Card>
    </div>
  )
}
