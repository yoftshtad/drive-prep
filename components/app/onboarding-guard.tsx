'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { accessRedirect, hasActiveAccess, useSession } from '@/lib/access'

/**
 * Onboarding guard (PDF Phase 6/7): a signed-in student without active access
 * may view payment pages; anyone with active access goes straight to the dashboard.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, access, ready } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/login')
    } else if (hasActiveAccess(access)) {
      router.replace(accessRedirect(access))
    }
  }, [ready, user, access, router])

  if (!ready || !user || hasActiveAccess(access)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
      </div>
    )
  }

  return <>{children}</>
}
