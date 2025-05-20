import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPendingCourts } from "@/lib/simplified-court-api"
import { PendingCourtsList } from "@/components/admin/pending-courts-list"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function PendingCourtsPage() {
  try {
    const result = await getPendingCourts()
    
    if (!result.success) {
      throw new Error("Failed to load pending courts")
    }

    return (
      <div className="space-y-6">
        <AdminHeader title="Korty oczekujące na akceptację" />
        <Card>
          <CardHeader>
            <CardTitle>Lista kortów do akceptacji</CardTitle>
            <CardDescription>
              Zarządzaj kortami tenisowymi, które czekają na akceptację. Możesz edytować korty przed ich zatwierdzeniem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PendingCourtsList courts={result.courts} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading pending courts:", error);
    return (
      <div className="space-y-6">
        <AdminHeader title="Korty oczekujące na akceptację" />
        <Card>
          <CardHeader>
            <CardTitle>Lista kortów do akceptacji</CardTitle>
            <CardDescription>
              Zarządzaj kortami tenisowymi, które czekają na akceptację.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Wystąpił błąd podczas ładowania kortów</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
} 