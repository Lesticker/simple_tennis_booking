"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin/admin-header"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/debug")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminHeader title="Informacje debugowania" />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informacje systemowe</CardTitle>
            <Button onClick={fetchDebugInfo} disabled={loading}>
              {loading ? "Ładowanie..." : "Odśwież"}
            </Button>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
            ) : loading ? (
              <div className="p-4">Ładowanie informacji...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Katalog roboczy</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">{debugInfo?.cwd}</pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Katalog data</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p>
                      <strong>Ścieżka:</strong> {debugInfo?.dataDirectory?.path}
                    </p>
                    <p>
                      <strong>Istnieje:</strong> {debugInfo?.dataDirectory?.exists ? "Tak" : "Nie"}
                    </p>
                    {debugInfo?.dataDirectory?.exists && (
                      <div>
                        <strong>Zawartość:</strong>
                        <ul className="list-disc list-inside">
                          {debugInfo?.dataDirectory?.contents.length === 0 ? (
                            <li>Katalog jest pusty</li>
                          ) : (
                            debugInfo?.dataDirectory?.contents.map((item: string) => <li key={item}>{item}</li>)
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Dane kortów tenisowych</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(debugInfo?.tennisCourtData, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Zmienne środowiskowe</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(debugInfo?.env, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
