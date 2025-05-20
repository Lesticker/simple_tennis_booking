"use server"

import { revalidatePath } from "next/cache"
import type { BookingFormData, CourtStatus } from "./types"
import { getBookings, createBooking as createBookingDb } from "./bookings"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { TennisCourt } from "@prisma/client"
import { createTennisCourt, updateTennisCourtStatus } from "./db-utils"

export async function createBooking(data: BookingFormData) {
  try {
    console.log("Creating booking:", data)

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.error("User not authenticated")
      return { success: false, error: "User not authenticated" }
    }

    // Get user data with role
    const userData = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!userData) {
      return { success: false, error: "User not found" }
    }

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

    // For regular users, apply daily booking limit (max 3 hours per day)
    if (userData.role !== "ADMIN") {
      // Get booking date (reset hours to 00:00:00)
      const bookingDate = new Date(data.startTime)
      bookingDate.setHours(0, 0, 0, 0);

      // Check if user already has bookings for this day
      let bookingLimit = await db.bookingLimit.findFirst({
        where: {
          userId: userData.id,
          date: bookingDate
        }
      });

      if (bookingLimit) {
        // User already has bookings for this day, check if they've reached the limit
        if (bookingLimit.count >= 3) {
          return { 
            success: false, 
            error: "Przekroczono dzienny limit rezerwacji (maksymalnie 3 godziny dziennie). Możesz anulować istniejące rezerwacje i zarezerwować inny termin."
          }
        }

        // Increment the count
        await db.bookingLimit.update({
          where: { id: bookingLimit.id },
          data: { count: { increment: 1 } }
        });
      } else {
        // Create new booking limit record for this day
        await db.bookingLimit.create({
          data: {
            userId: userData.id,
            date: bookingDate,
            count: 1
          }
        });
      }
    }

    // Create new booking in database
    const newBooking = await createBookingDb({
      ...data,
      userId: userData.id
    })
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

export async function deleteBookingDb(bookingId: string) {
  try {
    console.log("Deleting booking with ID:", bookingId)
    
    // Sprawdź autentykację
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.error("User not authenticated")
      return false
    }

    // Pobierz dane użytkownika z sesji
    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!currentUser) {
      console.error("User not found in the database")
      return false
    }
    
    // Pobierz szczegóły rezerwacji
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { user: { select: { id: true, role: true } } }
    })

    if (!booking) {
      console.log("Booking not found, might have been already deleted")
      return true
    }

    // Sprawdź uprawnienia do usunięcia rezerwacji
    const isAdmin = currentUser.role === "ADMIN"
    const isOwner = booking.userId === currentUser.id

    if (!isAdmin && !isOwner) {
      console.error("User not authorized to delete this booking")
      return false
    }

    // Usuń rezerwację
    await db.booking.delete({
      where: { id: bookingId }
    })
    
    // Dla zwykłych użytkowników, zaktualizuj licznik rezerwacji
    if (booking.user && booking.user.role !== "ADMIN") {
      // Get booking date (reset hours to 00:00:00)
      const bookingDate = new Date(booking.startTime)
      bookingDate.setHours(0, 0, 0, 0);

      // Find the booking limit record for this day
      const bookingLimit = await db.bookingLimit.findFirst({
        where: {
          userId: booking.userId,
          date: bookingDate
        }
      });

      if (bookingLimit && bookingLimit.count > 0) {
        // Decrement the count
        await db.bookingLimit.update({
          where: { id: bookingLimit.id },
          data: { count: { decrement: 1 } }
        });
      }
    }
    
    revalidatePath('/courts/[id]', 'page')
    return true
  } catch (error) {
    console.error("Error in deleteBookingDb:", error)
    return false
  }
}

export async function submitTennisCourt(data: Omit<TennisCourt, "id" | "createdAt" | "updatedAt" | "status" | "bookings">) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user data based on email
    const userData = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!userData) {
      return { success: false, error: "User not found" }
    }

    // Limit submissions for regular users
    if (userData.role !== "ADMIN") {
      // Get today's date (reset hours to 00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if user already has a submission limit record for today
      let submissionLimit = await db.submissionLimit.findFirst({
        where: {
          userId: userData.id,
          date: today
        }
      });

      if (submissionLimit) {
        // User already has submissions today, check if they've reached the limit
        if (submissionLimit.count >= 6) {
          return { 
            success: false, 
            error: "Osiągnięto dzienny limit 6 zgłoszeń. Spróbuj ponownie jutro."
          }
        }

        // Increment the count
        await db.submissionLimit.update({
          where: { id: submissionLimit.id },
          data: { count: { increment: 1 } }
        });
      } else {
        // Create new submission limit record for today
        await db.submissionLimit.create({
          data: {
            userId: userData.id,
            date: today,
            count: 1
          }
        });
      }
    }

    // Create new court with pending status using our utility function
    const newCourt = await createTennisCourt({
      ...data,
      submittedById: userData.id // Track who submitted the court
    });

    console.log("Successfully created new court with ID:", newCourt.id, "and status:", newCourt.status);

    revalidatePath("/")
    revalidatePath("/admin/courts")
    revalidatePath("/admin/pending-courts") // Explicitly revalidate pending courts
    return { success: true, court: newCourt }
  } catch (error) {
    console.error("Error submitting tennis court:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}

export async function updateCourtStatus(id: string, status: CourtStatus) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user is admin in the database
    const user = await db.user.findUnique({
      where: { email: session.user.email || "" },
      select: { role: true }
    })

    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized - Admin access required" }
    }

    const updatedCourt = await db.tennisCourt.update({
      where: { id },
      data: { status }
    })

    revalidatePath("/")
    revalidatePath("/admin/courts")
    revalidatePath(`/courts/${id}`)
    revalidatePath("/admin/pending-courts")
    return { success: true, court: updatedCourt }
  } catch (error) {
    console.error("Error updating court status:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}
