"use server"

import { db } from "@/lib/db"
import type { RawTennisCourt } from "@/lib/types"

/**
 * Process a raw tennis court from SQL query result to ensure proper formatting
 */
function processCourt(rawCourt: any): RawTennisCourt {
  // Parse features if needed
  let features = rawCourt.features;
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch (e) {
      console.error("Failed to parse features JSON:", e);
      features = [];
    }
  }

  // Parse openingHours if needed
  let openingHours = rawCourt.openingHours;
  if (typeof openingHours === 'string') {
    try {
      openingHours = JSON.parse(openingHours);
    } catch (e) {
      console.error("Failed to parse openingHours JSON:", e);
      openingHours = {};
    }
  }

  return {
    ...rawCourt,
    features,
    openingHours,
    // Ensure dates are in string format if they're Date objects
    createdAt: rawCourt.createdAt instanceof Date ? rawCourt.createdAt.toISOString() : rawCourt.createdAt,
    updatedAt: rawCourt.updatedAt instanceof Date ? rawCourt.updatedAt.toISOString() : rawCourt.updatedAt
  };
}

/**
 * Get all tennis courts
 */
export async function getAllTennisCourts() {
  try {
    // Use raw SQL to avoid Prisma type issues
    const rawCourts = await db.$queryRaw`
      SELECT * FROM "TennisCourt"
      ORDER BY "createdAt" DESC
    `;

    // Process the raw courts
    const courts = Array.isArray(rawCourts) 
      ? rawCourts.map(court => processCourt(court)) 
      : [];

    return { success: true, courts };
  } catch (error) {
    console.error("Error fetching all courts:", error);
    return { success: false, courts: [] };
  }
}

/**
 * Get only approved tennis courts
 */
export async function getApprovedTennisCourts() {
  try {
    // Use raw SQL to avoid Prisma type issues
    const rawCourts = await db.$queryRaw`
      SELECT * FROM "TennisCourt" 
      WHERE "status" = 'APPROVED'::"CourtStatus" 
      ORDER BY "createdAt" DESC
    `;

    // Process the raw courts
    const courts = Array.isArray(rawCourts) 
      ? rawCourts.map(court => processCourt(court)) 
      : [];

    return { success: true, courts };
  } catch (error) {
    console.error("Error fetching approved courts:", error);
    return { success: false, courts: [] };
  }
}

/**
 * Get court by ID
 */
export async function getTennisCourtDirectById(id: string) {
  try {
    // Use raw SQL to avoid Prisma type issues
    const courts = await db.$queryRaw`
      SELECT * FROM "TennisCourt" 
      WHERE "id" = ${id}
    `;
    
    // Return the first court or null if not found
    const rawCourt = Array.isArray(courts) && courts.length > 0 ? courts[0] : null;
    const court = rawCourt ? processCourt(rawCourt) : null;
    
    return { success: true, court };
  } catch (error) {
    console.error("Error fetching court by ID:", error);
    return { success: false, court: null };
  }
}

/**
 * Delete a tennis court by ID
 */
export async function deleteTennisCourtDirect(id: string) {
  try {
    // Używamy Prisma do usunięcia kortu, ponieważ raw SQL byłoby bardziej skomplikowane 
    // ze względu na powiązania
    await db.tennisCourt.delete({
      where: { id }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting court:", error);
    return { success: false, error: "Failed to delete court" };
  }
}

/**
 * Create a tennis court with status PENDING
 */
export async function createTennisCourtDirect(data: any) {
  try {
    // Przygotuj dane do insertu
    const { name, address, description, imageUrl, latitude, longitude, features, openingHours } = data;

    // Konwertuj obiekty do JSON i sprawdź, czy features jest tablicą
    const openingHoursJson = JSON.stringify(openingHours);
    const featuresArray = Array.isArray(features) ? features : [];
    
    // Przygotuj parametry do zapytania SQL
    const params = [name, address, description, imageUrl, latitude, longitude];
    
    // Przygotuj zapytanie SQL z odpowiednim formatowaniem dla features
    let featuresClause;
    if (featuresArray.length === 0) {
      featuresClause = "ARRAY[]::text[]";
    } else {
      featuresClause = `ARRAY[${featuresArray.map((_: any, i: number) => `$${params.length + i + 1}::text`).join(', ')}]`;
      params.push(...featuresArray);
    }
    
    // Dodaj openingHours jako ostatni parametr
    params.push(openingHoursJson);
    
    // Użyj raw SQL, aby obejść problemy z typami enum
    const result = await db.$queryRawUnsafe(`
      INSERT INTO "TennisCourt" (
        "name", "address", "description", "imageUrl", "latitude", "longitude", 
        "features", "openingHours", "status", "createdAt", "updatedAt"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 
        ${featuresClause}, $${params.length}::jsonb, 
        'PENDING'::"CourtStatus", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `, ...params);

    // Przetwórz wynik
    const court = Array.isArray(result) && result.length > 0 
      ? processCourt(result[0]) 
      : null;

    return { success: true, court };
  } catch (error) {
    console.error("Error creating tennis court:", error);
    return { success: false, error: "Failed to create tennis court" };
  }
}

/**
 * Update a tennis court
 */
export async function updateTennisCourtDirect(id: string, data: any) {
  try {
    // Przygotuj dane do aktualizacji
    const updateFields = [];
    const params = [];
    
    // Dodaj tylko te pola, które zostały przekazane w data
    if (data.name !== undefined) {
      updateFields.push(`"name" = $${params.length + 1}`);
      params.push(data.name);
    }
    
    if (data.address !== undefined) {
      updateFields.push(`"address" = $${params.length + 1}`);
      params.push(data.address);
    }
    
    if (data.description !== undefined) {
      updateFields.push(`"description" = $${params.length + 1}`);
      params.push(data.description);
    }
    
    if (data.imageUrl !== undefined) {
      updateFields.push(`"imageUrl" = $${params.length + 1}`);
      params.push(data.imageUrl);
    }
    
    if (data.latitude !== undefined) {
      updateFields.push(`"latitude" = $${params.length + 1}`);
      params.push(data.latitude);
    }
    
    if (data.longitude !== undefined) {
      updateFields.push(`"longitude" = $${params.length + 1}`);
      params.push(data.longitude);
    }
    
    if (data.features !== undefined) {
      // Przekształć tablicę cech na format akceptowalny przez PostgreSQL
      const featuresArray = Array.isArray(data.features) ? data.features : [];
      
      if (featuresArray.length === 0) {
        // Obsługa pustej tablicy
        updateFields.push(`"features" = ARRAY[]::text[]`);
      } else {
        updateFields.push(`"features" = ARRAY[${featuresArray.map((_: any, i: number) => `$${params.length + i + 1}::text`).join(', ')}]`);
        params.push(...featuresArray);
      }
    }
    
    if (data.openingHours !== undefined) {
      updateFields.push(`"openingHours" = $${params.length + 1}::jsonb`);
      params.push(JSON.stringify(data.openingHours));
    }
    
    // Zawsze aktualizuj updatedAt
    updateFields.push(`"updatedAt" = CURRENT_TIMESTAMP`);
    
    // Jeśli nie ma pól do aktualizacji, zwróć błąd
    if (updateFields.length === 0) {
      return { success: false, error: "No fields to update" };
    }
    
    // Dodaj ID do parametrów
    params.push(id);
    
    // Wykonaj zapytanie
    const updateQuery = `
      UPDATE "TennisCourt"
      SET ${updateFields.join(", ")}
      WHERE "id" = $${params.length}
      RETURNING *
    `;
    
    const result = await db.$queryRawUnsafe(updateQuery, ...params);
    
    // Przetwórz wynik
    const court = Array.isArray(result) && result.length > 0 
      ? processCourt(result[0]) 
      : null;
    
    return { success: true, court };
  } catch (error) {
    console.error("Error updating tennis court:", error);
    return { success: false, error: "Failed to update tennis court" };
  }
} 