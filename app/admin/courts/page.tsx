import { getTennisCourts } from "@/lib/tennis-courts"
import { AdminTennisCourtsList } from "@/components/admin/admin-tennis-courts-list"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminCourtsPage() {
  const tennisCourts = await getTennisCourts()

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title="Zarządzanie kortami tenisowymi" />
      <AdminTennisCourtsList tennisCourts={tennisCourts} />
    </div>
  )
}
