import { NextResponse } from "next/server"
import { getCourtById, updateCourtStatus, deleteCourt } from "@/lib/services/tennis-courts"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const court = await getCourtById(params.id)

    if (!court) {
      return NextResponse.json(
        { error: "Court not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ court })
  } catch (error) {
    console.error("Error fetching court:", error)
    return NextResponse.json(
      { error: "Failed to fetch court" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const court = await updateCourtStatus(params.id, data.status)

    if (!court) {
      return NextResponse.json(
        { error: "Court not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ court })
  } catch (error) {
    console.error("Error updating court:", error)
    return NextResponse.json(
      { error: "Failed to update court" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const court = await deleteCourt(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting court:", error)
    return NextResponse.json(
      { error: "Failed to delete court" },
      { status: 500 }
    )
  }
} 