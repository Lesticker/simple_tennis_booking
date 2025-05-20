import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getPendingCourts } from "@/lib/services/tennis-courts"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin in the database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const courts = await getPendingCourts()
    return NextResponse.json({ courts })
  } catch (error) {
    console.error("Error fetching pending courts:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending courts" },
      { status: 500 }
    )
  }
} 