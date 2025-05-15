import { getTennisCourtById } from "@/lib/tennis-courts"
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
    const court = await getTennisCourtById(id)
    
    if (!court) {
      notFound()
    }

    const bookings = await getBookingsByCourtId(id)
    console.log("Server-side bookings:", bookings)

    return <TennisCourtPageClient court={court} bookings={bookings} />
  } catch (error) {
    console.error('Error loading court page:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: TennisCourtPageProps) {
  const { id } = await Promise.resolve(params)
  
  try {
    const court = await getTennisCourtById(id)
    return {
      title: court ? `Kort ${court.name}` : 'Kort tenisowy',
    }
  } catch {
    return {
      title: 'Kort tenisowy',
    }
  }
}