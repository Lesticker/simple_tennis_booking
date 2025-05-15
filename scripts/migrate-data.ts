import { prisma } from '../lib/db'
import fs from 'fs/promises'
import path from 'path'

async function migrateData() {
  try {
    // Read existing courts from JSON
    const courtsData = await fs.readFile(path.join(process.cwd(), 'data', 'tennis-courts.json'), 'utf-8')
    const courts = JSON.parse(courtsData)

    // Insert courts
    for (const court of courts) {
      await prisma.tennisCourt.create({
        data: {
          id: court.id,
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
    }

    // Read existing bookings from JSON
    const bookingsData = await fs.readFile(path.join(process.cwd(), 'data', 'bookings.json'), 'utf-8')
    const bookings = JSON.parse(bookingsData)

    // Insert bookings
    for (const booking of bookings) {
      await prisma.booking.create({
        data: {
          id: booking.id,
          firstName: booking.firstName,
          lastName: booking.lastName,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
          courtId: booking.courtId
        }
      })
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()
