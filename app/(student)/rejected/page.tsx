'use client'

import Link from 'next/link'
import { CircleAlert } from 'lucide-react'
import { useSession } from '@/lib/access'

export default function RejectedPage() {
  const { access, ready } = useSession()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
      </div>
    )
  }

  if (access === 'active') return null

  return (
    <div className="mx-auto max-w-xl py-16 px-5 text-center">
      <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-red-100">
        <CircleAlert className="size-12 text-red-600" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Access denied</h1>
      <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-muted-foreground">
        Your account was not approved. Please contact support if you believe this is a mistake, or create a new account
        with correct payment information.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/register"
          className="flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Create new account
        </Link>
        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}