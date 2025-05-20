"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { submitTennisCourt } from "@/lib/actions"

export function SubmitCourtForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("/images/court-default.png")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [features, setFeatures] = useState("")

  // Default opening hours
  const defaultHours = {
    open: "08:00",
    close: "20:00",
  }

  const defaultWeekendHours = {
    open: "09:00",
    close: "19:00",
  }

  const [openingHours, setOpeningHours] = useState({
    monday: defaultHours,
    tuesday: defaultHours,
    wednesday: defaultHours,
    thursday: defaultHours,
    friday: defaultHours,
    saturday: defaultWeekendHours,
    sunday: defaultWeekendHours,
  })

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string
    address?: string
    description?: string
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Wymagane logowanie",
        description: "Musisz być zalogowany, aby zgłosić kort.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

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
        latitude: latitude ? Number.parseFloat(latitude) : null,
        longitude: longitude ? Number.parseFloat(longitude) : null,
        features: features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        openingHours,
      }

      const result = await submitTennisCourt(courtData)

      if (result.success) {
        toast({
          title: "Kort zgłoszony",
          description: "Twoje zgłoszenie zostało przyjęte i oczekuje na weryfikację przez administratora.",
        })

        // Reset form
        setName("")
        setAddress("")
        setDescription("")
        setImageUrl("/images/court-default.png")
        setLatitude("")
        setLongitude("")
        setFeatures("")

        router.refresh()
        router.push("/")
      } else {
        toast({
          title: "Błąd",
          description: result.error || "Wystąpił błąd podczas zgłaszania kortu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas zgłaszania kortu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zgłoś nowy kort tenisowy</CardTitle>
        <CardDescription>
          {session?.user ? (
            "Wypełnij formularz, aby zgłosić nowy kort tenisowy. Po weryfikacji przez administratora kort zostanie dodany do bazy."
          ) : (
            "Zaloguj się, aby zgłosić nowy kort tenisowy."
          )}
        </CardDescription>
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

            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              label="Zdjęcie kortu"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Szerokość geograficzna (opcjonalnie)</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="np. 50.748"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Długość geograficzna (opcjonalnie)</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="np. 19.178"
                />
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zgłaszanie..." : "Zgłoś kort"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 