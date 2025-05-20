"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteTennisCourt } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
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
import type { RawTennisCourt } from "@/lib/types"

interface AdminTennisCourtsListProps {
  tennisCourts: RawTennisCourt[]
}

export function AdminTennisCourtsList({ tennisCourts }: AdminTennisCourtsListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [courtToDelete, setCourtToDelete] = useState<RawTennisCourt | null>(null)

  const handleDeleteClick = (court: RawTennisCourt) => {
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
      router.refresh()
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

  // Funkcja do formatowania statusu kortu
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'PENDING': { label: 'Oczekujący', className: 'bg-yellow-100 text-yellow-800' },
      'APPROVED': { label: 'Zatwierdzony', className: 'bg-green-100 text-green-800' },
      'REJECTED': { label: 'Odrzucony', className: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista kortów tenisowych</CardTitle>
        <Link href="/admin/courts/new">
          <Button>Dodaj nowy kort</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {tennisCourts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Brak kortów tenisowych</p>
            <Link href="/admin/courts/new">
              <Button>Dodaj pierwszy kort</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Zdjęcie</th>
                  <th className="text-left py-3 px-4">Nazwa</th>
                  <th className="text-left py-3 px-4">Adres</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {tennisCourts.map((court) => (
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
                    <td className="py-3 px-4">{getStatusBadge(court.status)}</td>
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
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edytuj</span>
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(court)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
    </Card>
  )
}
