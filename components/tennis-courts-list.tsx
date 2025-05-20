"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { RawTennisCourt } from "@/lib/types"

interface TennisCourtsListProps {
  tennisCourts: RawTennisCourt[]
}

export function TennisCourtsList({ tennisCourts }: TennisCourtsListProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListIcon className="mr-2 h-5 w-5" />
          Lista kortów tenisowych
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {tennisCourts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Brak dostępnych kortów tenisowych</p>
          ) : (
            tennisCourts.map((court) => (
              <Link key={court.id} href={`/courts/${court.id}`} className="block">
                <div className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40 w-full">
                    <Image
                      src={court.imageUrl || "/placeholder.svg"}
                      alt={court.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{court.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{court.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(court.features) && court.features.map((feature, index) => (
                        <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
