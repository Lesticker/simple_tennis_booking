"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { updateCourtStatus } from "@/lib/simplified-court-api"
import { deleteTennisCourt } from "@/lib/admin-actions"
import type { CourtStatus } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Używam bardziej generycznego typu dla kortów z SQL
interface TennisCourtRaw {
  id: string
  name: string
  address: string
  imageUrl: string
  createdAt: string | Date
  [key: string]: any  // Dla innych pól
}

interface PendingCourtsListProps {
  courts: TennisCourtRaw[]
}

export function PendingCourtsList({ courts }: PendingCourtsListProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [courtToDelete, setCourtToDelete] = useState<TennisCourtRaw | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Force refresh when any operation completes
  useEffect(() => {
    router.refresh()
  }, [refreshKey, router])

  const handleStatusUpdate = async (courtId: string, status: CourtStatus) => {
    try {
      setIsProcessing(true)
      const result = await updateCourtStatus(courtId, status)

      if (result.success) {
        toast({
          title: status === "APPROVED" ? "Kort zaakceptowany" : "Kort odrzucony",
          description: status === "APPROVED"
            ? "Kort został zaakceptowany i jest teraz widoczny publicznie."
            : "Kort został odrzucony.",
        })
        setRefreshKey(prev => prev + 1) // Trigger refresh
      } else {
        toast({
          title: "Błąd",
          description: result.error || "Wystąpił błąd podczas aktualizacji statusu kortu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating court status:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji statusu kortu.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteClick = (court: TennisCourtRaw) => {
    setCourtToDelete(court)
  }

  const handleDeleteConfirm = async () => {
    if (!courtToDelete) return

    try {
      setIsDeleting(true)
      await deleteTennisCourt(courtToDelete.id)
      toast({
        title: "Kort usunięty",
        description: `Kort "${courtToDelete.name}" został pomyślnie usunięty.`,
      })
      setRefreshKey(prev => prev + 1) // Trigger refresh
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas usuwania kortu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCourtToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setCourtToDelete(null)
  }

  // Funkcja pomocnicza do formatowania daty
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("pl-PL");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista kortów do akceptacji</CardTitle>
        </CardHeader>
        <CardContent>
          {courts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Brak kortów oczekujących na akceptację</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Zdjęcie</th>
                    <th className="text-left py-3 px-4">Nazwa</th>
                    <th className="text-left py-3 px-4">Adres</th>
                    <th className="text-left py-3 px-4">Data zgłoszenia</th>
                    <th className="text-left py-3 px-4">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.map((court) => (
                    <tr key={court.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="relative h-16 w-24 rounded overflow-hidden">
                          <Image
                            src={court.imageUrl || "/placeholder.svg"}
                            alt={court.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{court.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{court.address}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDate(court.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={`/courts/${court.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Zobacz</span>
                            </Button>
                          </Link>
                          <Link href={`/admin/courts/edit/${court.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 text-blue-500" />
                              <span className="sr-only">Edytuj</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(court.id, "APPROVED")}
                            disabled={isProcessing}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Zaakceptuj</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(court.id, "REJECTED")}
                            disabled={isProcessing}
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Odrzuć</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(court)}
                            disabled={isProcessing || isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Usuń</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!courtToDelete} onOpenChange={() => !isDeleting && setCourtToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten kort?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja spowoduje usunięcie kortu "{courtToDelete?.name}" i wszystkich jego rezerwacji. Tej operacji nie
              można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 