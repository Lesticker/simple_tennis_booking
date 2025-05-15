const getGoogleMapsApiKey = () => {
  // Sprawdź czy jesteśmy po stronie klienta
  if (typeof window !== 'undefined') {
    // Jeśli jesteśmy w przeglądarce, użyj zmiennej z window.__env__
    // @ts-ignore
    return window.__env__?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  }
  
  // Po stronie serwera
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
}

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey()

// Dodaj ostrzeżenie tylko w środowisku deweloperskim
if (process.env.NODE_ENV !== 'production' && !GOOGLE_MAPS_API_KEY) {
  console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in development environment')
  console.info('Please create .env.local file with your Google Maps API key')
}