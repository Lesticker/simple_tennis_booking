import getConfig from 'next/config'

const getGoogleMapsApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey && process.env.NODE_ENV === 'development') {
    console.warn('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in development environment')
    console.info('Please create .env.local file with your Google Maps API key')
  }

  return apiKey || ''
}

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''