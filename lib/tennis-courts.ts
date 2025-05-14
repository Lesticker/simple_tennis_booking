import fs from "fs/promises"
import path from "path"
import type { TennisCourt } from "./types"

const tennisCourtFilePath = path.join(process.cwd(), "data", "tennis-courts.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    console.log("Creating data directory...")
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function getTennisCourts(): Promise<TennisCourt[]> {
  try {
    await ensureDataDirectory()

    try {
      console.log("Reading tennis courts from:", tennisCourtFilePath)
      const data = await fs.readFile(tennisCourtFilePath, "utf8")
      const courts = JSON.parse(data)
      console.log(`Found ${courts.length} tennis courts`)
      return courts
    } catch (error) {
      console.log("Tennis courts file not found or invalid, creating default courts")
      // If file doesn't exist or is invalid, return default courts
      const defaultCourts = [
        {
          id: "1",
          name: "Kort Tenisowy Słowik",
          address: "Równoległa 74A, 42-263 Słowik",
          description:
            "Darmowy kort tenisowy z nawierzchnią z mączki ceglanej, dostępny dla wszystkich mieszkańców. Kort jest ogrodzony i posiada podstawowe oznaczenia linii. Idealny do gry rekreacyjnej i nauki tenisa.",
          imageUrl: "/images/court-slowik.png",
          latitude: 50.748,
          longitude: 19.178,
          features: ["Darmowy", "Nawierzchnia ceglana", "Ogrodzony"],
          openingHours: {
            monday: { open: "08:00", close: "20:00" },
            tuesday: { open: "08:00", close: "20:00" },
            wednesday: { open: "08:00", close: "20:00" },
            thursday: { open: "08:00", close: "20:00" },
            friday: { open: "08:00", close: "20:00" },
            saturday: { open: "09:00", close: "19:00" },
            sunday: { open: "09:00", close: "19:00" },
          },
        },
      ]
      await saveTennisCourts(defaultCourts)
      return defaultCourts
    }
  } catch (error) {
    console.error("Error reading tennis courts:", error)
    return []
  }
}

export async function getTennisCourtById(id: string): Promise<TennisCourt | null> {
  const courts = await getTennisCourts()
  return courts.find((court) => court.id === id) || null
}

export async function saveTennisCourts(courts: TennisCourt[]): Promise<void> {
  try {
    await ensureDataDirectory()
    console.log(`Saving ${courts.length} tennis courts to:`, tennisCourtFilePath)
    await fs.writeFile(tennisCourtFilePath, JSON.stringify(courts, null, 2), "utf8")
    console.log("Tennis courts saved successfully")
  } catch (error) {
    console.error("Error saving tennis courts:", error)
    throw error
  }
}

export async function addTennisCourt(court: Omit<TennisCourt, "id">): Promise<TennisCourt> {
  try {
    console.log("Adding new tennis court:", court.name)
    const courts = await getTennisCourts()

    // Generate a unique ID
    const newId = courts.length > 0 ? (Math.max(...courts.map((c) => Number.parseInt(c.id))) + 1).toString() : "1"

    const newCourt = {
      ...court,
      id: newId,
    }

    courts.push(newCourt)
    await saveTennisCourts(courts)
    console.log("New tennis court added with ID:", newId)
    return newCourt
  } catch (error) {
    console.error("Error adding tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<TennisCourt>): Promise<TennisCourt | null> {
  try {
    console.log("Updating tennis court with ID:", id)
    const courts = await getTennisCourts()
    const courtIndex = courts.findIndex((court) => court.id === id)

    if (courtIndex === -1) {
      console.log("Tennis court not found with ID:", id)
      return null
    }

    courts[courtIndex] = {
      ...courts[courtIndex],
      ...courtData,
    }

    await saveTennisCourts(courts)
    console.log("Tennis court updated successfully")
    return courts[courtIndex]
  } catch (error) {
    console.error("Error updating tennis court:", error)
    throw error
  }
}

export async function deleteTennisCourt(id: string): Promise<boolean> {
  try {
    console.log("Deleting tennis court with ID:", id)
    const courts = await getTennisCourts()
    const filteredCourts = courts.filter((court) => court.id !== id)

    if (filteredCourts.length === courts.length) {
      console.log("Tennis court not found with ID:", id)
      return false
    }

    await saveTennisCourts(filteredCourts)
    console.log("Tennis court deleted successfully")
    return true
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    throw error
  }
}
