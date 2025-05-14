"use server"

import { revalidatePath } from "next/cache"
import type { BookingFormData } from "./types"
import { getBookings, saveBookings } from "./bookings"
import { v4 as uuidv4 } from "uuid"

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

    // Create new booking
    const newBooking = {
      id: uuidv4(),
      ...data,
    }

    // Add to bookings and save
    bookings.push(newBooking)
    await saveBookings(bookings)
    console.log("Booking created successfully with ID:", newBooking.id)

    revalidatePath("/")
    revalidatePath(`/courts/${data.courtId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating booking:", error)
    // Zwróć bardziej szczegółowy komunikat błędu
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    console.log("Deleting booking with ID:", bookingId)
    const bookings = await getBookings()
    const booking = bookings.find((b) => b.id === bookingId)

    if (!booking) {
      console.log("Booking not found with ID:", bookingId)
      throw new Error("Booking not found")
    }

    const updatedBookings = bookings.filter((booking) => booking.id !== bookingId)

    await saveBookings(updatedBookings)
    console.log("Booking deleted successfully")
    revalidatePath("/")
    revalidatePath(`/courts/${booking.courtId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting booking:", error)
    // Zwróć bardziej szczegółowy komunikat błędu
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}
