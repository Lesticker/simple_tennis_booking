import { db } from "@/lib/db"
import type { TennisCourt, Prisma } from "@prisma/client"

export async function getPendingCourts() {
  return db.tennisCourt.findMany({
    where: {
      status: "PENDING"
    } as Prisma.TennisCourtWhereInput,
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getApprovedCourts() {
  return db.tennisCourt.findMany({
    where: {
      status: "APPROVED"
    } as Prisma.TennisCourtWhereInput,
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getAllCourts() {
  return db.tennisCourt.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getCourtById(id: string) {
  return db.tennisCourt.findUnique({
    where: { id }
  })
}

export async function createCourt(data: Omit<TennisCourt, "id" | "createdAt" | "updatedAt" | "status" | "bookings">) {
  return db.tennisCourt.create({
    data: {
      ...data,
      status: "PENDING"
    }
  })
}

export async function updateCourtStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  return db.tennisCourt.update({
    where: { id },
    data: { status }
  })
}

export async function deleteCourt(id: string) {
  return db.tennisCourt.delete({
    where: { id }
  })
} 