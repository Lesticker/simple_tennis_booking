import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Sprawdź katalog data
    const dataDir = path.join(process.cwd(), "data")
    let dirExists = false
    let dirContents = []
    let tennisCourtData = null

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
    } catch (error) {
      dirExists = false
    }

    return NextResponse.json({
      cwd: process.cwd(),
      dataDirectory: {
        path: dataDir,
        exists: dirExists,
        contents: dirContents,
      },
      tennisCourtData,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
