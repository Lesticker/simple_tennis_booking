import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { TennisCourt } from "@/lib/types"

interface TennisCourtDetailsProps {
  court: TennisCourt
}

export function TennisCourtDetails({ court }: TennisCourtDetailsProps) {
  // Mapowanie dni tygodnia na język polski
  const daysTranslation: Record<string, string> = {
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do listy kortów
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div>
          <h1 className="text-3xl font-bold mb-2">{court.name}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{court.address}</span>
          </div>

          <div className="relative h-[300px] md:h-[400px] w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={court.imageUrl || "/placeholder.svg"}
              alt={court.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Opis</h2>
            <p>{court.description}</p>

            <h2 className="text-xl font-semibold">Udogodnienia</h2>
            <div className="flex flex-wrap gap-2">
              {court.features.map((feature, index) => (
                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Godziny otwarcia
              </h2>
              <div className="space-y-2">
                {Object.entries(court.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{daysTranslation[day]}</span>
                    <span>
                      {hours.open} - {hours.close}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Lokalizacja</h2>
                <div className="relative h-[200px] w-full rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${court.latitude},${court.longitude}&zoom=15`}
                  ></iframe>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Współrzędne: {court.latitude}, {court.longitude}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
