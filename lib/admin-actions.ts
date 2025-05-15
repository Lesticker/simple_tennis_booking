"use server"

import { revalidatePath } from "next/cache"
import {
  deleteTennisCourt as deleteTennisCourtData,
  addTennisCourt as addTennisCourtData,
  updateTennisCourt as updateTennisCourtData,
} from "./tennis-courts"
import { getBookings, deleteBooking } from "./bookings"
import type { TennisCourt } from "./types"

export async function deleteTennisCourt(id: string) {
  try {
    console.log("Admin action: Deleting tennis court with ID:", id)
    // Usuń kort
    const success = await deleteTennisCourtData(id)

    if (!success) {
      throw new Error("Court not found")
    }

    // Usuń wszystkie rezerwacje dla tego kortu
    const bookings = await getBookings()
    const courtBookings = bookings.filter((booking) => booking.courtId === id)
    
    // Usuń każdą rezerwację osobno
    for (const booking of courtBookings) {
      await deleteBooking(booking.id)
    }

    revalidatePath("/")
    revalidatePath("/admin/courts")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    throw error
  }
}

export async function addTennisCourt(courtData: Omit<TennisCourt, "id">) {
  try {
    console.log("Admin action: Adding new tennis court:", courtData.name)
    const newCourt = await addTennisCourtData(courtData)

    revalidatePath("/")
    revalidatePath("/admin/courts")
    return newCourt
  } catch (error) {
    console.error("Error adding tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<TennisCourt>) {
  try {
    console.log("Admin action: Updating tennis court with ID:", id)
    const updatedCourt = await updateTennisCourtData(id, courtData)

    if (!updatedCourt) {
      throw new Error("Court not found")
    }

    revalidatePath("/")
    revalidatePath(`/courts/${id}`)
    revalidatePath("/admin/courts")
    return updatedCourt
  } catch (error) {
    console.error("Error updating tennis court:", error)
    throw error
  }
}
