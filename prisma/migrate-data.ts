const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Rozpoczynam migrację danych...')

    // Wczytaj dane z plików JSON
    const courtsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tennis-courts.json'), 'utf8'))
    const bookingsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf8'))

    console.log(`Znaleziono ${courtsData.length} kortów w pliku JSON`)
    console.log(`Znaleziono ${bookingsData.length} rezerwacji w pliku JSON`)

    // Przenieś dane do bazy
    for (const court of courtsData) {
      await prisma.tennisCourt.create({
        data: court
      })
    }
    console.log('Korty zostały przeniesione do bazy')

    for (const booking of bookingsData) {
      await prisma.booking.create({
        data: booking
      })
    }
    console.log('Rezerwacje zostały przeniesione do bazy')

  } catch (error) {
    console.error('Błąd podczas migracji:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()