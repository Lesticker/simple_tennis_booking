export interface Booking {
  id: string
  firstName: string
  lastName: string
  startTime: string
  endTime: string
  courtId: string // Dodane pole identyfikatora kortu
}

export interface BookingFormData {
  firstName: string
  lastName: string
  startTime: string
  endTime: string
  courtId: string // Dodane pole identyfikatora kortu
}

export interface TennisCourt {
  id: string
  name: string
  address: string
  description: string
  imageUrl: string
  latitude: number
  longitude: number
  features: string[]
  openingHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
}
