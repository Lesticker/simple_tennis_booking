import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapIcon } from "lucide-react"

export function MapFallback() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapIcon className="mr-2 h-5 w-5" />
          Mapa kortów tenisowych
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full h-[500px] rounded-md bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Ładowanie mapy...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
