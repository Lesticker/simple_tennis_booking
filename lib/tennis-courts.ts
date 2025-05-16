import { db } from "./db"
import { TennisCourt, Prisma } from "@prisma/client"

export async function getTennisCourts(): Promise<TennisCourt[]> {
  try {
    const courts = await db.tennisCourt.findMany()
    return courts.map(court => ({
      ...court,
      features: court.features as string[],
      openingHours: court.openingHours as Prisma.JsonObject,
    }))
  } catch (error) {
    console.error("Error reading tennis courts:", error)
    return []
  }
}

export async function getTennisCourtById(id: string): Promise<TennisCourt | null> {
  try {
    const court = await db.tennisCourt.findUnique({
      where: { id }
    })
    
    if (!court) return null

    return {
      ...court,
      features: court.features as string[],
      openingHours: court.openingHours as Prisma.JsonObject,
    }
  } catch (error) {
    console.error("Error reading tennis court:", error)
    return null
  }
}

export async function addTennisCourt(court: Omit<TennisCourt, "id" | "createdAt" | "updatedAt">): Promise<TennisCourt> {
  try {
    const newCourt = await db.tennisCourt.create({
      data: {
        name: court.name,
        address: court.address,
        description: court.description,
        imageUrl: court.imageUrl,
        latitude: court.latitude,
        longitude: court.longitude,
        features: court.features,
        openingHours: court.openingHours as Prisma.JsonObject,
      }
    })

    return newCourt
  } catch (error) {
    console.error("Error creating tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<Omit<TennisCourt, "id" | "createdAt" | "updatedAt">>): Promise<TennisCourt | null> {
  try {
    const updatedCourt = await db.tennisCourt.update({
      where: { id },
      data: {
        ...courtData,
        openingHours: courtData.openingHours as Prisma.JsonObject,
      }
    })

    return updatedCourt
  } catch (error) {
    console.error("Error updating tennis court:", error)
    return null
  }
}

export async function deleteTennisCourt(id: string): Promise<boolean> {
  try {
    await db.tennisCourt.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    return false
  }
}