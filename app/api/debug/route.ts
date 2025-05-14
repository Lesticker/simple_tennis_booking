import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { getDataDirectory } from "@/lib/data-directory"

export async function GET() {
  try {
    // Pobierz katalog danych
    const dataDir = await getDataDirectory()
    let dirExists = false
    let dirContents = []
    let tennisCourtData = null
    let bookingsData = null

    try {
      await fs.access(dataDir)
      dirExists = true
      dirContents = await fs.readdir(dataDir)

      // Spróbuj odczytać plik z kortami
      const tennisCourtFilePath = path.join(dataDir, "tennis-courts.json")
      try {
        const data = await fs.readFile(tennisCourtFilePath, "utf8")
        tennisCourtData = JSON.parse(data)
      } catch (error) {
        tennisCourtData = { error: "Nie można odczytać pliku tennis-courts.json", details: error.message }
      }

      // Spróbuj odczytać plik z rezerwacjami
      const bookingsFilePath = path.join(dataDir, "bookings.json")
      try {
        const data = await fs.readFile(bookingsFilePath, "utf8")
        bookingsData = JSON.parse(data)
      } catch (error) {
        bookingsData = { error: "Nie można odczytać pliku bookings.json", details: error.message }
      }
    } catch (error) {
      dirExists = false
    }

    // Sprawdź uprawnienia do zapisu
    let writePermission = false
    try {
      const testFilePath = path.join(dataDir, "test-write.txt")
      await fs.writeFile(testFilePath, "test")
      await fs.unlink(testFilePath)
      writePermission = true
    } catch (error) {
      writePermission = false
    }

    return NextResponse.json({
      cwd: process.cwd(),
      dataDirectory: {
        path: dataDir,
        exists: dirExists,
        contents: dirContents,
        writePermission,
      },
      tennisCourtData,
      bookingsData,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL: process.env.VERCEL,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
