import { prisma } from './db'
import type { TennisCourt } from './types'

export async function getTennisCourts(): Promise<TennisCourt[]> {
  try {
    const courts = await prisma.tennisCourt.findMany()
    return courts.map(court => ({
      ...court,
      features: court.features as string[],
      openingHours: court.openingHours as {
        [key: string]: {
          open: string
          close: string
        }
      }
    }))
  } catch (error) {
    console.error("Error reading tennis courts:", error)
    return []
  }
}

export async function getTennisCourtById(id: string): Promise<TennisCourt | null> {
  try {
    const court = await prisma.tennisCourt.findUnique({
      where: { id }
    })
    
    if (!court) return null

    return {
      ...court,
      features: court.features as string[],
      openingHours: court.openingHours as {
        [key: string]: {
          open: string
          close: string
        }
      }
    }
  } catch (error) {
    console.error("Error reading tennis court:", error)
    return null
  }
}

export async function addTennisCourt(court: Omit<TennisCourt, "id">): Promise<TennisCourt> {
  try {
    const newCourt = await prisma.tennisCourt.create({
      data: {
        name: court.name,
        address: court.address,
        description: court.description,
        imageUrl: court.imageUrl,
        latitude: court.latitude,
        longitude: court.longitude,
        features: court.features,
        openingHours: court.openingHours
      }
    })

    return {
      ...newCourt,
      features: newCourt.features as string[],
      openingHours: newCourt.openingHours as {
        [key: string]: {
          open: string
          close: string
        }
      }
    }
  } catch (error) {
    console.error("Error adding tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<TennisCourt>): Promise<TennisCourt | null> {
  try {
    const updatedCourt = await prisma.tennisCourt.update({
      where: { id },
      data: courtData
    })

    return {
      ...updatedCourt,
      features: updatedCourt.features as string[],
      openingHours: updatedCourt.openingHours as {
        [key: string]: {
          open: string
          close: string
        }
      }
    }
  } catch (error) {
    console.error("Error updating tennis court:", error)
    return null
  }
}

export async function deleteTennisCourt(id: string): Promise<boolean> {
  try {
    await prisma.tennisCourt.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    return false
  }
}