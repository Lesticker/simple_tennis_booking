import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, List, Plus, Clock } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Panel Administracyjny</h1>
            <Link href="/">
              <Button variant="secondary" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Powrót do strony głównej
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-muted py-2">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <Link href="/admin/courts">
              <Button variant="ghost" size="sm">
                <List className="mr-2 h-4 w-4" />
                Lista kortów
              </Button>
            </Link>
            <Link href="/admin/courts/add">
              <Button variant="ghost" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj kort
              </Button>
            </Link>
            <Link href="/admin/pending-courts">
              <Button variant="ghost" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Korty do akceptacji
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
