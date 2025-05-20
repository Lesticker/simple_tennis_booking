import { getTennisCourtDirectById } from "@/lib/tennis-courts-direct"
import { AdminHeader } from "@/components/admin/admin-header"
import { TennisCourtForm } from "@/components/admin/tennis-court-form"
import { notFound } from "next/navigation"

interface EditTennisCourtPageProps {
  params: {
    id: string
  }
}

export default async function EditTennisCourtPage({ params }: EditTennisCourtPageProps) {
  const result = await getTennisCourtDirectById(params.id)

  if (!result.success || !result.court) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title={`Edytuj kort: ${result.court.name}`} />
      <TennisCourtForm court={result.court} />
    </div>
  )
}
