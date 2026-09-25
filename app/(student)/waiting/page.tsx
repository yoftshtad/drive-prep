'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircleCheck, Clock } from 'lucide-react'
import { useSession } from '@/lib/access'
import { getPayments } from '@/lib/payment-store'

export default function WaitingPage() {
  const { access, ready } = useSession()
  const router = useRouter()
  const [screenshotSent, setScreenshotSent] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (access === 'active') router.push('/dashboard')
    else if (access === 'rejected') router.push('/rejected')
  }, [ready, access, router])

  useEffect(() => {
    if (!ready) return
    // Check if user already has a pending payment with receipt
    const payments = getPayments()
    const user = getUserFromSession()
    if (user) {
      const hasPendingWithReceipt = payments.some(
        p => (p.userEmail === user.email || p.userPhone === user.phone) && p.status === 'pending' && p.receiptUrl
      )
      setScreenshotSent(hasPendingWithReceipt)
    }
  }, [ready])

  function getUserFromSession() {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem('dp.user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-xl py-16 px-5 text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-amber-100">
          <span className="size-12 text-amber-600">⏳</span>
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Loading…</h1>
        <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-muted-foreground">
          Checking your verification status…
        </p>
      </div>
    )
  }

  // If access is pending, show waiting content immediately (no spinner)
  return (
    <div className="mx-auto max-w-xl py-16 px-5 text-center">
      <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-amber-100">
        <span className="size-12 text-amber-600">⏳</span>
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Waiting for approval</h1>
      <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-muted-foreground">
        Your account has been created and is pending admin review. An admin will verify your payment
        on Telegram and activate your access.
      </p>

      <div className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-600">
          <span className="size-4">⏳</span> Status: Pending admin verification
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Please wait until an admin verifies your payment on Telegram. You&apos;ll be redirected automatically once approved.
        </p>
      </div>

      {screenshotSent && (
        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600">
            <span className="size-4">✅</span> Screenshot received — admin is reviewing
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Your payment screenshot has been sent to the admin on Telegram.</p>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">This page checks for updates automatically. You&apos;ll be redirected once approved.</p>
    </div>
  )
}