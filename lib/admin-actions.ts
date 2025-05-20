"use server"

import { revalidatePath } from "next/cache"
import { createTennisCourtDirect, deleteTennisCourtDirect, updateTennisCourtDirect } from "./tennis-courts-direct"
import { getBookings } from "./bookings"
import { deleteBookingDb } from "./bookings"
import type { TennisCourt } from "@prisma/client"

export async function deleteTennisCourt(id: string) {
  try {
    console.log("Admin action: Deleting tennis court with ID:", id)
    
    // Delete all bookings for this court
    const bookings = await getBookings()
    const courtBookings = bookings.filter((booking) => booking.courtId === id)
    
    // Delete each booking separately
    for (const booking of courtBookings) {
      await deleteBookingDb(booking.id)
    }
    
    // Delete court
    const result = await deleteTennisCourtDirect(id)

    if (!result.success) {
      throw new Error(result.error || "Court not found")
    }

    // Make sure to revalidate all relevant paths
    revalidatePath("/")
    revalidatePath("/admin/courts")
    revalidatePath("/admin/pending-courts")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    throw error
  }
}

export async function addTennisCourt(courtData: Omit<TennisCourt, "id" | "createdAt" | "updatedAt" | "status" | "bookings">) {
  try {
    console.log("Admin action: Adding new tennis court:", courtData.name)
    
    // Use our new direct DB access function to add the court
    const result = await createTennisCourtDirect(courtData)
    
    if (!result.success) {
      throw new Error(result.error || "Error creating tennis court")
    }

    revalidatePath("/")
    revalidatePath("/admin/courts")
    return result.court
  } catch (error) {
    console.error("Error adding tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<TennisCourt>) {
  try {
    console.log("Admin action: Updating tennis court with ID:", id)
    
    // Use our new direct DB access function to update the court
    const result = await updateTennisCourtDirect(id, courtData)

    if (!result.success) {
      throw new Error(result.error || "Court not found")
    }

    revalidatePath("/")
    revalidatePath(`/courts/${id}`)
    revalidatePath("/admin/courts")
    return result.court
  } catch (error) {
    console.error("Error updating tennis court:", error)
    throw error
  }
}
