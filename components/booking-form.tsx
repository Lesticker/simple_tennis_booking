"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBooking } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

// Dostępne godziny - cała doba
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return `${hour}:00`
})

interface BookingFormProps {
  onSuccess?: () => void
  courtId: string
}

export function BookingForm({ onSuccess, courtId }: BookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)

  // Form validation
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    date?: string
    time?: string
  }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate form
    const newErrors: {
      firstName?: string
      lastName?: string
      date?: string
      time?: string
    } = {}

    if (!firstName || firstName.length < 2) {
      newErrors.firstName = "Imię musi mieć co najmniej 2 znaki."
    }

    if (!lastName || lastName.length < 2) {
      newErrors.lastName = "Nazwisko musi mieć co najmniej 2 znaki."
    }

    if (!date) {
      newErrors.date = "Proszę wybrać datę."
    }

    if (!time) {
      newErrors.time = "Proszę wybrać godzinę."
    }

    setErrors(newErrors)

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)

      // Create date objects for start and end times
      const dateStr = format(date as Date, "yyyy-MM-dd")
      const startTime = new Date(`${dateStr}T${time}:00`)
      const endTime = new Date(startTime)
      endTime.setHours(endTime.getHours() + 1)

      const result = await createBooking({
        firstName,
        lastName,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        courtId,
      })

      if (result.success) {
        toast({
          title: "Rezerwacja potwierdzona!",
          description: `Twój kort jest zarezerwowany na ${format(date as Date, "d MMMM yyyy", {
            locale: pl,
          })} o godzinie ${time}.`,
        })

        // Reset form
        setFirstName("")
        setLastName("")
        setDate(undefined)
        setTime(undefined)

        // Refresh data
        if (onSuccess) {
          onSuccess()
        }

        router.refresh()
      } else {
        // Wyświetl szczegółowy komunikat błędu
        toast({
          title: "Błąd",
          description: result.error || "Wystąpił błąd podczas przetwarzania rezerwacji.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas przetwarzania rezerwacji.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zarezerwuj kort</CardTitle>
        <CardDescription>Wybierz datę i godzinę, aby zarezerwować kort tenisowy.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Imię</Label>
            <Input id="firstName" placeholder="Jan" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nazwisko</Label>
            <Input
              id="lastName"
              placeholder="Kowalski"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
                >
                  {date ? format(date, "d MMMM yyyy", { locale: pl }) : <span>Wybierz datę</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={pl}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Godzina</Label>
            <Select onValueChange={setTime} value={time}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Wybierz godzinę" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {timeSlots.map((timeSlot) => (
                  <SelectItem key={timeSlot} value={timeSlot}>
                    {timeSlot} - {timeSlot.split(":")[0]}:59
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Każda rezerwacja trwa 1 godzinę.</p>
            {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Rezerwowanie..." : "Zarezerwuj kort"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
