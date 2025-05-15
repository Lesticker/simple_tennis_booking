const getGoogleMapsApiKey = () => {
  // Sprawdź czy zmienna jest dostępna w runtime config
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Debugowanie
  console.log("Runtime API Key:", apiKey)
  console.log("Environment:", process.env.NODE_ENV)
  
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in development environment')
      console.info('Please create .env.local file with your Google Maps API key')
    }
    return ''
  }

  return apiKey
}

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey()