import { db } from "@/lib/db"
import type { CourtStatus } from "@/lib/types"

/**
 * Create a tennis court with proper type handling
 */
export async function createTennisCourt(data: any) {
  // Log the court being created
  console.log("Creating tennis court:", {
    name: data.name,
    address: data.address,
    status: "PENDING"
  });
  
  return db.tennisCourt.create({
    data: {
      ...data,
      status: "PENDING" as CourtStatus, // Using explicit type casting for clarity
    },
  })
}

/**
 * Update a tennis court status with proper type handling
 */
export async function updateTennisCourtStatus(id: string, status: CourtStatus) {
  console.log(`Updating tennis court ${id} status to ${status}`);
  
  // Using Prisma's raw query to avoid type issues with enums
  return db.$executeRaw`
    UPDATE "TennisCourt"
    SET "status" = ${status}::text::"CourtStatus"
    WHERE "id" = ${id}
  `;
} 