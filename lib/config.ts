const getGoogleMapsApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    // W środowisku produkcyjnym wyświetl błąd tylko w konsoli
    if (process.env.NODE_ENV === 'production') {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in environment variables')
      return '' // Zwróć pusty string zamiast undefined
    }
    // W środowisku deweloperskim wyświetl instrukcje
    console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in development environment')
    console.info('Please create .env.local file with your Google Maps API key')
    return '' // Zwróć pusty string zamiast undefined
  }

  return apiKey
}

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey()