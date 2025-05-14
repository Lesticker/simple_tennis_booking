"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { addTennisCourt, updateTennisCourt } from "@/lib/admin-actions"
import type { TennisCourt } from "@/lib/types"

interface TennisCourtFormProps {
  court?: TennisCourt
}

export function TennisCourtForm({ court }: TennisCourtFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState(court?.name || "")
  const [address, setAddress] = useState(court?.address || "")
  const [description, setDescription] = useState(court?.description || "")
  const [imageUrl, setImageUrl] = useState(court?.imageUrl || "/images/court-slowik.png")
  const [latitude, setLatitude] = useState(court?.latitude.toString() || "")
  const [longitude, setLongitude] = useState(court?.longitude.toString() || "")
  const [features, setFeatures] = useState(court?.features.join(", ") || "")

  // Godziny otwarcia
  const defaultHours = {
    open: "08:00",
    close: "20:00",
  }

  const defaultWeekendHours = {
    open: "09:00",
    close: "19:00",
  }

  const [openingHours, setOpeningHours] = useState({
    monday: court?.openingHours.monday || defaultHours,
    tuesday: court?.openingHours.tuesday || defaultHours,
    wednesday: court?.openingHours.wednesday || defaultHours,
    thursday: court?.openingHours.thursday || defaultHours,
    friday: court?.openingHours.friday || defaultHours,
    saturday: court?.openingHours.saturday || defaultWeekendHours,
    sunday: court?.openingHours.sunday || defaultWeekendHours,
  })

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string
    address?: string
    description?: string
    latitude?: string
    longitude?: string
  }>({})

  const handleOpeningHoursChange = (day: string, type: "open" | "close", value: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [type]: value,
      },
    }))
  }

  const validateForm = () => {
    const newErrors: {
      name?: string
      address?: string
      description?: string
      latitude?: string
      longitude?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Nazwa kortu jest wymagana"
    }

    if (!address.trim()) {
      newErrors.address = "Adres kortu jest wymagany"
    }

    if (!description.trim()) {
      newErrors.description = "Opis kortu jest wymagany"
    }

    if (!latitude.trim() || isNaN(Number(latitude))) {
      newErrors.latitude = "Szerokość geograficzna musi być liczbą"
    }

    if (!longitude.trim() || isNaN(Number(longitude))) {
      newErrors.longitude = "Długość geograficzna musi być liczbą"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const courtData = {
        name,
        address,
        description,
        imageUrl,
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
        features: features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        openingHours,
      }

      console.log("Submitting court data:", courtData)

      if (court) {
        // Aktualizacja istniejącego kortu
        await updateTennisCourt(court.id, courtData)
        toast({
          title: "Kort zaktualizowany",
          description: `Kort "${name}" został pomyślnie zaktualizowany.`,
        })
      } else {
        // Dodawanie nowego kortu
        await addTennisCourt(courtData)
        toast({
          title: "Kort dodany",
          description: `Kort "${name}" został pomyślnie dodany.`,
        })
      }

      // Odśwież stronę i przekieruj do listy kortów
      router.refresh()
      router.push("/admin/courts")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas zapisywania kortu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{court ? "Edytuj kort tenisowy" : "Dodaj nowy kort tenisowy"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa kortu</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Kort Tenisowy Słowik"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="np. Równoległa 74A, 42-263 Słowik"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opisz kort, jego nawierzchnię, udogodnienia itp."
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL zdjęcia</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="np. /images/court-slowik.png"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Szerokość geograficzna</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="np. 50.748"
                />
                {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Długość geograficzna</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="np. 19.178"
                />
                {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Udogodnienia (oddzielone przecinkami)</Label>
              <Input
                id="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="np. Darmowy, Nawierzchnia ceglana, Ogrodzony"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Godziny otwarcia</h3>

              {Object.entries(openingHours).map(([day, hours]) => {
                const dayNames: Record<string, string> = {
                  monday: "Poniedziałek",
                  tuesday: "Wtorek",
                  wednesday: "Środa",
                  thursday: "Czwartek",
                  friday: "Piątek",
                  saturday: "Sobota",
                  sunday: "Niedziela",
                }

                return (
                  <div key={day} className="grid grid-cols-3 gap-4 items-center">
                    <Label className="text-right">{dayNames[day]}</Label>
                    <div className="space-y-2">
                      <Label htmlFor={`${day}-open`} className="sr-only">
                        Otwarcie
                      </Label>
                      <Input
                        id={`${day}-open`}
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOpeningHoursChange(day, "open", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${day}-close`} className="sr-only">
                        Zamknięcie
                      </Label>
                      <Input
                        id={`${day}-close`}
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOpeningHoursChange(day, "close", e.target.value)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/courts")}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : court ? "Zapisz zmiany" : "Dodaj kort"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
