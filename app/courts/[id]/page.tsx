import { getTennisCourtById } from "@/lib/tennis-courts"
import { TennisCourtDetails } from "@/components/tennis-court-details"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingForm } from "@/components/booking-form"
import { getBookingsByCourtId } from "@/lib/bookings"
import { notFound } from "next/navigation"

interface TennisCourtPageProps {
  params: {
    id: string
  }
}

export default async function TennisCourtPage({ params }: TennisCourtPageProps) {
  const court = await getTennisCourtById(params.id)

  if (!court) {
    notFound()
  }

  const bookings = await getBookingsByCourtId(params.id)

  return (
    <div className="container mx-auto py-8 px-4">
      <TennisCourtDetails court={court} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Zarezerwuj ten kort</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <BookingCalendar bookings={bookings} />
          <BookingForm courtId={court.id} />
        </div>
      </div>
    </div>
  )
}
