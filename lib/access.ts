'use client'

import { useEffect, useState } from 'react'
import { getAccessState, getUser, subscribe, type SessionUser } from './session'
import type { AccessState } from './types'

export { getAccessState, setAccessState } from './session'

/**
 * Central access rule (PDF section 4).
 * UNPAID -> PENDING -> APPROVED(ACTIVE) | REJECTED -> RESUBMIT
 */
export function hasActiveAccess(state: AccessState): boolean {
  return state === 'active'
}

export function accessRedirect(state: AccessState): string {
  switch (state) {
    case 'active':
      return '/dashboard'
    case 'pending':
      return '/payment/pending'
    case 'rejected':
      return '/payment/rejected'
    default:
      return '/payment'
  }
}

export function useSession(): { user: SessionUser | null; access: AccessState; ready: boolean } {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [access, setAccess] = useState<AccessState>('unpaid')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setUser(getUser())
      setAccess(getAccessState())
    }
    sync()
    setReady(true)
    return subscribe(sync)
  }, [])

  return { user, access, ready }
}
