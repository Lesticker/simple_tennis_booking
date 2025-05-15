const getGoogleMapsApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    // Sprawdź czy jesteśmy w środowisku produkcyjnym
    if (process.env.NODE_ENV === 'production') {
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in production environment')
    } else {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in development environment')
      console.info('Please create .env.local file with your Google Maps API key')
    }
  }

  return apiKey || ''
}

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey()