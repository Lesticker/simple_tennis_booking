"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CourtStatus } from "@/lib/types"

/**
 * Get pending courts
 */
export async function getPendingCourts() {
  try {
    console.log("Fetching pending courts...");
    
    // Use raw SQL to avoid Prisma type issues - with improved logging
    const courts = await db.$queryRaw`
      SELECT * FROM "TennisCourt" 
      WHERE "status" = 'PENDING'::"CourtStatus" 
      ORDER BY "createdAt" DESC
    `;
    
    console.log(`Found ${Array.isArray(courts) ? courts.length : 0} pending courts`);
    
    // Add debug logging for each court
    if (Array.isArray(courts)) {
      courts.forEach((court, index) => {
        console.log(`Pending court ${index + 1}: ID=${court.id}, Name=${court.name}, Status=${court.status}`);
      });
    }
    
    return { success: true, courts };
  } catch (error) {
    console.error("Error fetching pending courts:", error);
    return { success: false, courts: [] };
  }
}

/**
 * Get approved courts
 */
export async function getApprovedCourts() {
  try {
    // Use raw SQL to avoid Prisma type issues
    const courts = await db.$queryRaw`
      SELECT * FROM "TennisCourt" 
      WHERE "status" = 'APPROVED'::"CourtStatus" 
      ORDER BY "createdAt" DESC
    `
    return { success: true, courts }
  } catch (error) {
    console.error("Error fetching approved courts:", error)
    return { success: false, courts: [] }
  }
}

/**
 * Update a court's status
 */
export async function updateCourtStatus(id: string, status: CourtStatus) {
  try {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return { success: false, error: "Invalid status" }
    }

    // Use $executeRaw to avoid Prisma type issues, with proper type casting to enum
    await db.$executeRaw`
      UPDATE "TennisCourt"
      SET "status" = ${status}::text::"CourtStatus"
      WHERE "id" = ${id}
    `

    revalidatePath("/")
    revalidatePath("/admin/courts")
    revalidatePath(`/courts/${id}`)
    revalidatePath("/admin/pending-courts")

    return { success: true }
  } catch (error) {
    console.error("Error updating court status:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}

/**
 * Create a new court with PENDING status
 */
export async function createPendingCourt(data: any) {
  try {
    // Create the court with a SQL query to avoid Prisma type issues
    const { name, address, description, imageUrl, latitude, longitude, features, openingHours } = data

    // Convert objects to JSON strings for the database
    const featuresString = JSON.stringify(features)
    const openingHoursString = JSON.stringify(openingHours)

    const court = await db.$queryRaw`
      INSERT INTO "TennisCourt" ("name", "address", "description", "imageUrl", "latitude", "longitude", "features", "openingHours", "status", "createdAt", "updatedAt")
      VALUES (${name}, ${address}, ${description}, ${imageUrl}, ${latitude}, ${longitude}, ${featuresString}::jsonb, ${openingHoursString}::jsonb, 'PENDING'::"CourtStatus", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `

    revalidatePath("/")
    revalidatePath("/admin/courts")

    return { success: true, court }
  } catch (error) {
    console.error("Error creating pending court:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Unknown error occurred" }
  }
} 