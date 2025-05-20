import { db } from "@/lib/db"
import type { CourtStatus } from "@/lib/types"

/**
 * Create a tennis court with proper type handling
 */
export async function createTennisCourt(data: any) {
  return db.tennisCourt.create({
    data: {
      ...data,
      status: "PENDING", // Using string literal which will be converted to enum by Prisma
    },
  })
}

/**
 * Update a tennis court status with proper type handling
 */
export async function updateTennisCourtStatus(id: string, status: CourtStatus) {
  return db.tennisCourt.update({
    where: { id },
    data: { 
      status // Using string literal which will be converted to enum by Prisma
    },
  })
} 