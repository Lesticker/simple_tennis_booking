import { getTennisCourtDirectById } from "@/lib/tennis-courts-direct"
import { getBookingsByCourtId } from "@/lib/bookings"
import { notFound } from "next/navigation"
import TennisCourtPageClient from "./client"

interface TennisCourtPageProps {
  params: {
    id: string
  }
}

export default async function TennisCourtPage({ params }: TennisCourtPageProps) {
  const { id } = await Promise.resolve(params)
  
  try {
    const result = await getTennisCourtDirectById(id)
    
    if (!result.success || !result.court) {
      notFound()
    }

    const bookings = await getBookingsByCourtId(id)
    console.log("Server-side bookings:", bookings)

    return <TennisCourtPageClient court={result.court} bookings={bookings} />
  } catch (error) {
    console.error('Error loading court page:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: TennisCourtPageProps) {
  const { id } = await Promise.resolve(params)
  
  try {
    const result = await getTennisCourtDirectById(id)
    return {
      title: result.success && result.court ? `Kort ${result.court.name}` : 'Kort tenisowy',
    }
  } catch {
    return {
      title: 'Kort tenisowy',
    }
  }
}