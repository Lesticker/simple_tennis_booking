import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAuthenticated = !!token

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Only protect booking actions, not court viewing
    if (req.nextUrl.pathname.startsWith("/courts/book") && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Allow all routes by default
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/courts/book/:path*"]
} 