import { Booking as PrismaBooking, TennisCourt as PrismaTennisCourt } from "@prisma/client"

// Re-export the enum type directly
export type CourtStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface BookingFormData {
  firstName: string
  lastName: string
  startTime: string
  endTime: string
  courtId: string
  userId?: string
}

// Re-export Prisma types with date fields as strings for frontend use
export type Booking = Omit<PrismaBooking, "createdAt" | "updatedAt" | "startTime" | "endTime"> & {
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export type TennisCourt = Omit<PrismaTennisCourt, "createdAt" | "updatedAt"> & {
  createdAt: string
  updatedAt: string
  openingHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
  reservationsEnabled: boolean
}

// Type for raw SQL query result court
export interface RawTennisCourt {
  id: string
  name: string
  address: string
  description: string
  imageUrl: string
  latitude: number
  longitude: number
  features: string[] | string // może być string (JSON) lub już sparsowana tablica
  openingHours: string | { [key: string]: { open: string, close: string } } // może być string (JSON) lub już sparsowany obiekt
  status: string
  reservationsEnabled?: boolean
  createdAt: string | Date
  updatedAt: string | Date
}
