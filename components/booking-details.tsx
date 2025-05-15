"use client"

import { useState } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteBookingDb } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import type { Booking } from "@/lib/types"

interface BookingDetailsProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

export function BookingDetails({ booking, isOpen, onClose, onDelete }: BookingDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!booking) {
    return null
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const success = await deleteBookingDb(booking.id)
      
      if (!success) {
        throw new Error("Failed to delete booking")
      }
      
      toast({
        title: "Rezerwacja anulowana",
        description: "Twoja rezerwacja została pomyślnie anulowana.",
      })
      onDelete()
      onClose()
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas anulowania rezerwacji.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Szczegóły rezerwacji</DialogTitle>
          <DialogDescription>Informacje o wybranej rezerwacji kortu tenisowego.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Imię:</div>
            <div className="col-span-3">{booking.firstName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Nazwisko:</div>
            <div className="col-span-3">{booking.lastName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Data:</div>
            <div className="col-span-3">{format(startTime, "d MMMM yyyy", { locale: pl })}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Godzina:</div>
            <div className="col-span-3">
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Zamknij
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Anulowanie..." : "Anuluj rezerwację"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
