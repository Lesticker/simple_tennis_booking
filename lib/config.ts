import getConfig from 'next/config'

const getGoogleMapsApiKey = () => {
  const { publicRuntimeConfig } = getConfig()
  const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const runtimeKey = publicRuntimeConfig?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Debugowanie
  console.log("Environment API Key:", envKey)
  console.log("Runtime Config API Key:", runtimeKey)
  console.log("Environment:", process.env.NODE_ENV)
  
  const apiKey = envKey || runtimeKey || ''

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in development environment')
      console.info('Please create .env.local file with your Google Maps API key')
    } else {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in production environment')
    }
  }

  return apiKey
}

export const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey()