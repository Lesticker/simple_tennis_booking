"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TennisCourt } from "@/lib/types"

interface TennisCourtsMapProps {
  tennisCourts: TennisCourt[]
}

// Declare google as a global variable
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
  const markersRef = useRef<google.maps.Marker[]>([])
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  // Inicjalizacja mapy Google
  const initializeMap = useCallback(() => {
    if (!mapRef.current) return

    console.log("Initializing map...")

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
  }, [])

  // Dodawanie markerów na mapie
  const addMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return

    console.log("Adding markers...")

    // Usuń istniejące markery
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Dodaj markery dla każdego kortu
    const newMarkers: google.maps.Marker[] = []
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
  }, [tennisCourts])

  // Ładowanie Google Maps API
  useEffect(() => {
    // Definiujemy funkcję inicjalizacji mapy w globalnym obiekcie window
    window.initMap = initializeMap

    const loadGoogleMapsAPI = () => {
      // Sprawdź, czy skrypt już istnieje
      if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        window.initMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    // Sprawdź, czy API Google Maps jest już załadowane
    if (window.google && window.google.maps) {
      initializeMap()
    } else {
      loadGoogleMapsAPI()
    }

    // Cleanup function
    return () => {
      // Usuń markery przy odmontowaniu komponentu
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []
      }
      // Usuń globalną funkcję initMap
      delete window.initMap
    }
  }, [initializeMap])

  // Dodaj markery, gdy mapa jest gotowa i korty są dostępne
  useEffect(() => {
    if (mapLoaded && tennisCourts.length > 0) {
      addMarkers()
    }
  }, [mapLoaded, tennisCourts, addMarkers])

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapIcon className="mr-2 h-5 w-5" />
          Mapa kortów tenisowych
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div ref={mapRef} className="w-full h-[500px] rounded-md" />
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
