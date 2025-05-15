"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TennisCourt } from "@/lib/types"
import { GOOGLE_MAPS_API_KEY } from "@/lib/config"

interface TennisCourtsMapProps {
  tennisCourts: TennisCourt[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function TennisCourtsMap({ tennisCourts }: TennisCourtsMapProps) {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const markersRef = useRef<any[]>([])
  const mapInstanceRef = useRef<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.log("Cannot initialize map: mapRef or google.maps not available")
      return
    }

    console.log("Initializing map...")

    try {
      const mapOptions = {
        center: { lat: 52.069, lng: 19.4803 }, // Centrum Polski
        zoom: 7,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      mapInstanceRef.current = newMap
      setMapLoaded(true)
      setMapError(null)
      console.log("Map initialized successfully")
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Nie udało się załadować mapy. Spróbuj odświeżyć stronę.")
    }
  }, [])

  const addMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) {
      console.log("Cannot add markers: map instance or google.maps not available")
      return
    }

    console.log("Adding markers...")

    try {
      // Usuń istniejące markery
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // Dodaj markery dla każdego kortu
      const newMarkers: any[] = []
      tennisCourts.forEach((court) => {
        console.log(`Adding marker for ${court.name} at lat: ${court.latitude}, lng: ${court.longitude}`)

        const marker = new window.google.maps.Marker({
          position: { lat: court.latitude, lng: court.longitude },
          map: mapInstanceRef.current,
          title: court.name,
          animation: window.google.maps.Animation.DROP,
        })

        // Dodaj okno informacyjne po kliknięciu na marker
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">${court.name}</h3>
              <p style="margin: 0 0 5px 0;">${court.address}</p>
              <a href="/courts/${court.id}" style="color: blue; text-decoration: underline;">Zobacz szczegóły</a>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        newMarkers.push(marker)
      })

      markersRef.current = newMarkers

      // Dostosuj widok mapy, aby pokazać wszystkie markery
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        newMarkers.forEach((marker) => {
          bounds.extend(marker.getPosition()!)
        })
        mapInstanceRef.current.fitBounds(bounds)

        // Jeśli jest tylko jeden marker, ustaw odpowiedni zoom
        if (newMarkers.length === 1) {
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(15)
            }
          }, 100)
        }
      }

      console.log("Map instance:", mapInstanceRef.current)
      console.log("Google Maps object:", window.google.maps)
      console.log("Number of courts:", tennisCourts.length)
    } catch (error) {
      console.error("Error adding markers:", error)
      setMapError("Nie udało się dodać markerów na mapę.")
    }
  }, [tennisCourts])

  const checkIfGoogleMapsLoaded = useCallback(() => {
    return window.google && window.google.maps
  }, [])

  useEffect(() => {
    window.initMap = () => {
      console.log("Google Maps API loaded via callback")
      setIsScriptLoaded(true)
      initializeMap()
    }

    const loadGoogleMapsAPI = () => {
      // Sprawdź, czy skrypt już istnieje
      if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        console.log("Google Maps script already exists in document")
        if (checkIfGoogleMapsLoaded()) {
          console.log("Google Maps API already loaded")
          setIsScriptLoaded(true)
          initializeMap()
        }
        return
      }

      console.log("Loading Google Maps API script...")
      const script = document.createElement("script")
      const apiKey = GOOGLE_MAPS_API_KEY
      console.log("API Key being used:", apiKey)
      
      if (!apiKey) {
        console.error("Google Maps API key is missing!")
        setMapError("Brak klucza API Google Maps. Skontaktuj się z administratorem.")
        return
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`
      script.async = true
      script.defer = true
      script.onerror = (error) => {
        console.error("Error loading Google Maps API script:", error)
        setMapError("Nie udało się załadować mapy Google. Spróbuj odświeżyć stronę.")
      }
      document.head.appendChild(script)
    }

    // Sprawdź, czy API Google Maps jest już załadowane
    if (checkIfGoogleMapsLoaded()) {
      console.log("Google Maps API already loaded on mount")
      setIsScriptLoaded(true)
      initializeMap()
    } else {
      loadGoogleMapsAPI()
    }

    // Cleanup function
    return () => {
      if (markersRef.current && window.google && window.google.maps) {
        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [initializeMap, checkIfGoogleMapsLoaded])

  // Dodaj markery, gdy mapa jest gotowa i korty są dostępne
  useEffect(() => {
    if (mapLoaded && tennisCourts.length > 0 && isScriptLoaded) {
      addMarkers()
    }
  }, [mapLoaded, tennisCourts, addMarkers, isScriptLoaded])

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapIcon className="mr-2 h-5 w-5" />
          Mapa kortów tenisowych
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {mapError ? (
          <div className="w-full h-[500px] rounded-md flex items-center justify-center bg-gray-100">
            <p className="text-red-500">{mapError}</p>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-[500px] rounded-md" />
        )}
        <div className="mt-2 text-xs text-muted-foreground">
          {tennisCourts.map((court) => (
            <p key={court.id}>
              {court.name}: {court.latitude}, {court.longitude}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}