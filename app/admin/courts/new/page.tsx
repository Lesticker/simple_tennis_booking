import { AdminHeader } from "@/components/admin/admin-header"
import { TennisCourtForm } from "@/components/admin/tennis-court-form"

export default function NewTennisCourtPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title="Dodaj nowy kort tenisowy" />
      <TennisCourtForm />
    </div>
  )
}
