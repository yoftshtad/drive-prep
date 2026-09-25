'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/access'

/**
 * Onboarding guard: a signed-in student without active access
 * may view payment pages; anyone with active access goes straight to the dashboard.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, access, ready } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/login')
    } else if (access === 'active') {
      router.replace('/dashboard')
    }
  }, [ready, user, access, router])

  if (!ready || !user || access === 'active') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
      </div>
    )
  }

  return <>{children}</>
}