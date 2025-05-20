import type { TennisCourt } from "@prisma/client"

interface GetTennisCourtsOptions {
  includeAll?: boolean
}

export async function getTennisCourts(options: GetTennisCourtsOptions = {}): Promise<TennisCourt[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/courts${options.includeAll ? "?includeAll=true" : ""}`,
      { cache: "no-store" }
    )
    if (!response.ok) {
      throw new Error("Failed to fetch courts")
    }
    const data = await response.json()
    return data.courts
  } catch (error) {
    console.error("Error reading tennis courts:", error)
    return []
  }
}

export async function getTennisCourtById(id: string): Promise<TennisCourt | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courts/${id}`, {
      cache: "no-store"
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data.court
  } catch (error) {
    console.error("Error reading tennis court:", error)
    return null
  }
}

export async function addTennisCourt(court: Omit<TennisCourt, "id" | "createdAt" | "updatedAt">): Promise<TennisCourt> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(court),
    })
    if (!response.ok) {
      throw new Error("Failed to add court")
    }
    const data = await response.json()
    return data.court
  } catch (error) {
    console.error("Error creating tennis court:", error)
    throw error
  }
}

export async function updateTennisCourt(id: string, courtData: Partial<Omit<TennisCourt, "id" | "createdAt" | "updatedAt">>): Promise<TennisCourt | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courtData),
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data.court
  } catch (error) {
    console.error("Error updating tennis court:", error)
    return null
  }
}

export async function deleteTennisCourt(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courts/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting tennis court:", error)
    return false
  }
}