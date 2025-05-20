/**
 * This file contains service functions for tennis courts
 * with proper type handling to avoid TypeScript errors
 */

import { db } from "@/lib/db"
import type { TennisCourt } from "@prisma/client"
import type { CourtStatus } from "@/lib/types"

/**
 * Get pending courts
 */
export async function getPendingCourts() {
  return db.tennisCourt.findMany({
    where: {
      status: "PENDING" as any
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

/**
 * Get approved courts
 */
export async function getApprovedCourts() {
  return db.tennisCourt.findMany({
    where: {
      status: "APPROVED" as any
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

/**
 * Get rejected courts
 */
export async function getRejectedCourts() {
  return db.tennisCourt.findMany({
    where: {
      status: "REJECTED" as any
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

/**
 * Get all courts
 */
export async function getAllCourts() {
  return db.tennisCourt.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
}

/**
 * Get a court by ID
 */
export async function getCourtById(id: string) {
  return db.tennisCourt.findUnique({
    where: { id }
  })
}

/**
 * Create a new court with PENDING status
 */
export async function createCourt(data: Omit<TennisCourt, "id" | "createdAt" | "updatedAt" | "status" | "bookings">) {
  return db.tennisCourt.create({
    data: {
      ...data,
      status: "PENDING" as any
    }
  })
}

/**
 * Update a court's status
 */
export async function updateCourtStatus(id: string, status: CourtStatus) {
  // Validate status
  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid status")
  }
  
  return db.tennisCourt.update({
    where: { id },
    data: {
      status: status as any
    }
  })
}

/**
 * Update a court
 */
export async function updateCourt(id: string, data: Partial<TennisCourt>) {
  return db.tennisCourt.update({
    where: { id },
    data: {
      ...data
    }
  })
}

/**
 * Delete a court
 */
export async function deleteCourt(id: string) {
  try {
    await db.tennisCourt.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error("Error deleting court:", error)
    return false
  }
} 