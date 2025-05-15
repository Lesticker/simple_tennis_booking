import { prisma } from '../lib/db'
import { getTennisCourts } from '../lib/tennis-courts'

async function migrateCourts() {
  try {
    // Get existing courts from JSON
    const courts = await getTennisCourts()
    
    // Insert each court into the database
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
    
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateCourts()
