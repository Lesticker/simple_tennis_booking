import { TennisCourtsMap } from "@/components/tennis-courts-map"
import { TennisCourtsList } from "@/components/tennis-courts-list"
import { getApprovedTennisCourts } from "@/lib/tennis-courts-direct"
import { Suspense } from "react"
import type { RawTennisCourt } from "@/lib/types"

export default async function Home() {
  const result = await getApprovedTennisCourts()
  const tennisCourts: RawTennisCourt[] = result.success ? result.courts : []

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Darmowe Korty Tenisowe</h1>
        <p className="text-muted-foreground mb-6">Znajdź i zarezerwuj darmowy kort tenisowy w Twojej okolicy</p>
      </header>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[1fr_350px]">
        <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Ładowanie mapy...</div>}>
          <TennisCourtsMap tennisCourts={tennisCourts} />
        </Suspense>
        <TennisCourtsList tennisCourts={tennisCourts} />
      </div>
    </div>
  )
}
