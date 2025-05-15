'use client'

import { TennisCourtDetails } from "@/components/tennis-court-details"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingForm } from "@/components/booking-form"
import { BookingDetails } from "@/components/booking-details"
import { useState } from "react"
import { Booking } from "@prisma/client"
import { deleteBookingDb } from "@/lib/actions"

interface TennisCourtPageClientProps {
  court: any
  bookings: Booking[]
}

export default function TennisCourtPageClient({ court, bookings }: TennisCourtPageClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleBookingSelect = (booking: Booking) => {
    console.log("Booking selected:", booking)
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  const handleBookingDelete = async (bookingId: string) => {
    try {
      const success = await deleteBookingDb(bookingId)
      
      if (!success) {
        throw new Error('Failed to delete booking')
      }
      
      setSelectedBooking(null)
      setIsDialogOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TennisCourtDetails court={court} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Zarezerwuj ten kort</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <BookingCalendar 
            bookings={bookings} 
            onSelectEvent={handleBookingSelect}
          />
          <BookingForm courtId={court.id} />
        </div>
      </div>

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setSelectedBooking(null)
          }}
          onDelete={() => handleBookingDelete(selectedBooking.id)}
        />
      )}
    </div>
  )
}

// ... reszta kodu pozostaje bez zmian ...