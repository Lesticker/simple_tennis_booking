import { db } from './db'
import type { Booking, BookingFormData } from './types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getBookings(): Promise<Booking[]> {
  try {
    const bookings = await db.booking.findMany()
    return bookings.map(booking => ({
      ...booking,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function getBookingsByCourtId(courtId: string): Promise<Booking[]> {
  try {
    console.log("Fetching bookings for court:", courtId)
    const bookings = await db.booking.findMany({
      where: {
        courtId: courtId
      }
    })
    console.log("Found bookings:", bookings)
    return bookings.map(booking => ({
      ...booking,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching bookings by court ID:', error)
    return []
  }
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session && !data.userId) {
      console.error("No session found and no userId provided")
      throw new Error('User not authenticated')
    }

    // Użyj userId z parametru, jeśli zostało przekazane, w przeciwnym razie użyj ID z sesji
    const userId = data.userId || (session?.user as any)?.id
    
    if (!userId) {
      console.error("No user ID available:", session)
      throw new Error('User ID not found')
    }

    console.log("Creating booking with userId:", userId)

    const booking = await db.booking.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        courtId: data.courtId,
        userId: userId
      }
    })

    return {
      ...booking,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export async function deleteBookingDb(id: string): Promise<boolean> {
  try {
    await db.booking.delete({
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

