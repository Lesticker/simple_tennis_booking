import fs from "fs/promises"
import path from "path"
import type { Booking } from "./types"
import { getDataDirectory } from "./data-directory"

// Pobierz ścieżkę do katalogu danych
const getBookingsFilePath = async () => {
  const dataDir = await getDataDirectory()
  return path.join(dataDir, "bookings.json")
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const bookingsFilePath = await getBookingsFilePath()
    console.log("Reading bookings from:", bookingsFilePath)

    try {
      const data = await fs.readFile(bookingsFilePath, "utf8")
      const bookings = JSON.parse(data)
      console.log(`Found ${bookings.length} bookings`)
      return bookings
    } catch (error) {
      console.log("Bookings file not found or invalid, creating empty bookings array")
      // If file doesn't exist or is invalid, return empty array
      await saveBookings([])
      return []
    }
  } catch (error) {
    console.error("Error reading bookings:", error)
    return []
  }
}

export async function getBookingsByCourtId(courtId: string): Promise<Booking[]> {
  const bookings = await getBookings()
  return bookings.filter((booking) => booking.courtId === courtId)
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  try {
    const bookingsFilePath = await getBookingsFilePath()
    console.log(`Saving ${bookings.length} bookings to:`, bookingsFilePath)
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf8")
    console.log("Bookings saved successfully")
  } catch (error) {
    console.error("Error saving bookings:", error)
    throw error
  }
}
