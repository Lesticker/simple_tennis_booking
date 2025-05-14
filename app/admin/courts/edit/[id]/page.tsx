import { getTennisCourtById } from "@/lib/tennis-courts"
import { AdminHeader } from "@/components/admin/admin-header"
import { TennisCourtForm } from "@/components/admin/tennis-court-form"
import { notFound } from "next/navigation"

interface EditTennisCourtPageProps {
  params: {
    id: string
  }
}

export default async function EditTennisCourtPage({ params }: EditTennisCourtPageProps) {
  const court = await getTennisCourtById(params.id)

  if (!court) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title={`Edytuj kort: ${court.name}`} />
      <TennisCourtForm court={court} />
    </div>
  )
}
