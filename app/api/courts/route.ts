import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAllCourts, getApprovedCourts, createCourt } from "@/lib/services/tennis-courts"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get("includeAll") === "true"

    const courts = includeAll ? await getAllCourts() : await getApprovedCourts()
    return NextResponse.json({ courts })
  } catch (error) {
    console.error("Error fetching courts:", error)
    return NextResponse.json(
      { error: "Failed to fetch courts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const court = await createCourt(data)
    return NextResponse.json({ court })
  } catch (error) {
    console.error("Error creating court:", error)
    return NextResponse.json(
      { error: "Failed to create court" },
      { status: 500 }
    )
  }
} 