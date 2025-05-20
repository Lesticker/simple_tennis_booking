import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, PlusCircle } from "lucide-react"

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Strona główna
            </Button>
          </Link>
          <Link href="/admin/pending-courts">
            <Button variant="outline" size="sm">
              Korty do akceptacji
            </Button>
          </Link>
          <Link href="/admin/courts/new">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj nowy kort
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-1 w-full bg-primary/10 rounded-full mb-6"></div>
    </div>
  )
}
