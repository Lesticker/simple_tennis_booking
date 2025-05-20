"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold">
          Tennis Courts
        </Link>
        <div className="ml-8 flex items-center space-x-4">
          <Link href="/submit-court">
            <Button variant="ghost">Zgłoś kort</Button>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <>
                  <Link href="/admin/courts">
                    <Button variant="ghost">Panel admina</Button>
                  </Link>
                  <Link href="/admin/pending-courts">
                    <Button variant="ghost">Korty do akceptacji</Button>
                  </Link>
                </>
              )}
              <Button variant="ghost" onClick={() => signOut()}>
                Wyloguj się
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Zaloguj się</Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Zarejestruj się</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 