import { prisma } from './db'
import type { Booking, BookingFormData } from './types'

export async function getBookings(): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany()
    return bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function getBookingsByCourtId(courtId: string): Promise<Booking[]> {
  try {
    console.log("Fetching bookings for court:", courtId)
    const bookings = await prisma.booking.findMany({
      where: {
        courtId: courtId
      }
    })
    console.log("Found bookings:", bookings)
    return bookings
  } catch (error) {
    console.error('Error fetching bookings by court ID:', error)
    return []
  }
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  try {
    const booking = await prisma.booking.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        courtId: data.courtId
      }
    })
    return booking
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export async function deleteBookingDb(id: string): Promise<boolean> {
  try {
    await prisma.booking.delete({
      where: {
        id: id
      }
    })
    return true
  } catch (error) {
    console.error('Error deleting booking:', error)
    return false
  }
}
