import { cn } from "@/lib/utils/cn"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  minSafe: number
  maxSafe: number
}

export function SensorCard({ title, value, unit, minSafe, maxSafe }: SensorCardProps) {
  const isInDanger = value < minSafe || value > maxSafe

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(1)} {unit}
        </div>
        <p className={cn(
          "text-xs mt-1",
          isInDanger ? "text-red-600 font-bold" : "text-muted-foreground"
        )}>
          {isInDanger ? "ALARM: Outside safe range!" : `Safe range: ${minSafe}-${maxSafe} ${unit}`}
        </p>
      </CardContent>
    </Card>
  )
}

