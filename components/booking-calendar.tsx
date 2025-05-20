"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, addMonths, subMonths } from "date-fns"
import { pl } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { Booking } from "@/lib/types"

interface BookingCalendarProps {
  bookings: Booking[]
  onSelectEvent?: (event: any) => void
}

// Funkcja pomocnicza do generowania dni w miesiącu
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days = []

  // Dodaj dni z poprzedniego miesiąca, aby wypełnić pierwszy tydzień
  const firstDay = date.getDay() || 7 // 0 = niedziela, 1 = poniedziałek, ..., 6 = sobota
  const daysFromPrevMonth = firstDay - 1 // Dla poniedziałku jako pierwszego dnia tygodnia

  if (daysFromPrevMonth > 0) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      days.push({
        date: new Date(prevMonthYear, prevMonth, i),
        isCurrentMonth: false,
        isToday: false,
      })
    }
  }

  // Dodaj dni z bieżącego miesiąca
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    })
  }

  // Dodaj dni z następnego miesiąca, aby wypełnić ostatni tydzień
  const lastDay = new Date(year, month, daysInMonth).getDay() || 7
  const daysFromNextMonth = 7 - lastDay

  if (daysFromNextMonth < 7) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextMonthYear = month === 11 ? year + 1 : year

    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false,
        isToday: false,
      })
    }
  }

  return days
}

// Funkcja pomocnicza do grupowania dni w tygodnie
const groupDaysIntoWeeks = (days: any[]) => {
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

// Funkcja pomocnicza do filtrowania rezerwacji dla danego dnia
const getBookingsForDay = (bookings: Booking[], date: Date) => {
  return bookings
    .filter((booking) => {
      const bookingDate = new Date(booking.startTime)
      return isSameDay(bookingDate, date)
    })
    .sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
}

export function BookingCalendar({ bookings, onSelectEvent }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  // Use useEffect to ensure the component is mounted before rendering the calendar
  useEffect(() => {
    setMounted(true)
  }, [])

  const goToPrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Generuj dni dla bieżącego miesiąca
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const weeks = groupDaysIntoWeeks(days)

  // Nazwy dni tygodnia
  const weekDays = ["Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob.", "Niedz."]

  if (!mounted) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Kalendarz rezerwacji kortu tenisowego
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[600px] flex items-center justify-center">Ładowanie kalendarza...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Kalendarz rezerwacji kortu tenisowego
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="mx-4 text-lg font-semibold">{format(currentDate, "MMMM yyyy", { locale: pl })}</h2>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          {/* Nagłówki dni tygodnia */}
          <div className="grid grid-cols-7 bg-muted">
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Dni miesiąca */}
          <div className="bg-card">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 border-t">
                {week.map((day: any, dayIndex: number) => {
                  const dayBookings = getBookingsForDay(bookings, day.date)

                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[100px] p-1 border-r last:border-r-0 ${
                        !day.isCurrentMonth ? "bg-muted/30 text-muted-foreground" : ""
                      } ${day.isToday ? "bg-primary/10" : ""}`}
                    >
                      <div className="text-right p-1 text-sm">{format(day.date, "d")}</div>

                      <div className="space-y-1 mt-1">
                        {dayBookings.length > 0 ? (
                          dayBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="bg-primary text-primary-foreground text-xs p-1 rounded cursor-pointer hover:bg-primary/90"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log("Booking clicked:", booking)
                                if (onSelectEvent) {
                                  onSelectEvent(booking)
                                } else {
                                  console.log("onSelectEvent is not defined")
                                }
                              }}
                            >
                              <div className="font-medium truncate">
                                {booking.firstName} {booking.lastName}
                              </div>
                              <div className="text-[10px]">
                                {format(new Date(booking.startTime), "HH:mm")} -{" "}
                                {format(new Date(booking.endTime), "HH:mm")}
                              </div>
                            </div>
                          ))
                        ) : day.isCurrentMonth ? (
                          <div className="text-xs text-muted-foreground text-center py-1">Brak rezerwacji</div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
