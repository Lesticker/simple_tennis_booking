import fs from "fs/promises"
import path from "path"

// Funkcja do pobierania lub tworzenia katalogu danych
export async function getDataDirectory(): Promise<string> {
  // W środowisku produkcyjnym i lokalnym używamy katalogu w projekcie
  const dataDir = path.join(process.cwd(), "data")
  console.log("Using data directory:", dataDir)

  try {
    // Sprawdź, czy katalog istnieje
    await fs.access(dataDir)
    console.log("Data directory exists:", dataDir)
  } catch (error) {
    // Jeśli nie istnieje, utwórz go
    console.log("Creating data directory:", dataDir)
    await fs.mkdir(dataDir, { recursive: true })
  }

  return dataDir
}
