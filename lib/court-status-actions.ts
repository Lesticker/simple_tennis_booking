"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CourtStatus } from "@/lib/types"

/**
 * Update court status with proper error handling and revalidation
 */
export async function updateCourtStatus(id: string, status: CourtStatus) {
  try {
    // Manually validate status to ensure it's one of the allowed values
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return { 
        success: false, 
        error: "Invalid status. Must be PENDING, APPROVED, or REJECTED." 
      }
    }

    // Simply execute the update query directly
    const updatedCourt = await db.tennisCourt.update({
      where: { id },
      data: {
        // Using any here to bypass TypeScript type checking
        // This is safe because we validated the status above
        status: status as any
      }
    })

    // Revalidate all paths that might display court information
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

/**
 * Creates a new tennis court with PENDING status
 */
export async function createPendingCourt(data: any) {
  try {
    const newCourt = await db.tennisCourt.create({
      data: {
        ...data,
        // Using any here to bypass TypeScript type checking
        status: "PENDING" as any
      }
    })

    revalidatePath("/")
    revalidatePath("/admin/courts")
    return { success: true, court: newCourt }
  } catch (error) {
    console.error("Error creating tennis court:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
} 