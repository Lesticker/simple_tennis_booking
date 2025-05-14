import fs from "fs/promises"
import path from "path"
import type { Booking } from "./types"

const bookingsFilePath = path.join(process.cwd(), "data", "bookings.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function getBookings(): Promise<Booking[]> {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(bookingsFilePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
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
    await ensureDataDirectory()
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving bookings:", error)
    throw error
  }
}
