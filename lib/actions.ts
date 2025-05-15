"use server"

import { revalidatePath } from "next/cache"
import type { BookingFormData } from "./types"
import { getBookings, createBooking as createBookingDb } from "./bookings"

export async function createBooking(data: BookingFormData) {
  try {
    console.log("Creating booking:", data)
    const bookings = await getBookings()

    // Check if the time slot is already booked for this court
    const isTimeSlotBooked = bookings.some((booking) => {
      if (booking.courtId !== data.courtId) return false

      const newStart = new Date(data.startTime)
      const newEnd = new Date(data.endTime)
      const bookingStart = new Date(booking.startTime)
      const bookingEnd = new Date(booking.endTime)

      return (
        (newStart >= bookingStart && newStart < bookingEnd) ||
        (newEnd > bookingStart && newEnd <= bookingEnd) ||
        (newStart <= bookingStart && newEnd >= bookingEnd)
      )
    })

    if (isTimeSlotBooked) {
      console.log("Time slot already booked")
      throw new Error("Time slot already booked")
    }

    // Create new booking in database
    const newBooking = await createBookingDb(data)
    console.log("Booking created successfully with ID:", newBooking.id)

    revalidatePath("/")
    revalidatePath(`/courts/${data.courtId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating booking:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    console.log("Deleting booking with ID:", bookingId)
    const success = await deleteBooking(bookingId)

    if (!success) {
      throw new Error("Failed to delete booking")
    }

    console.log("Booking deleted successfully")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting booking:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}
