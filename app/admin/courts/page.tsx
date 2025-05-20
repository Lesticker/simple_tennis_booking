import { getAllTennisCourts } from "@/lib/tennis-courts-direct"
import { AdminTennisCourtsList } from "@/components/admin/admin-tennis-courts-list"
import { AdminHeader } from "@/components/admin/admin-header"
import type { RawTennisCourt } from "@/lib/types"

export default async function AdminCourtsPage() {
  const result = await getAllTennisCourts()
  const tennisCourts: RawTennisCourt[] = result.success ? result.courts : []

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title="Zarządzanie kortami tenisowymi" />
      <AdminTennisCourtsList tennisCourts={tennisCourts} />
    </div>
  )
}
