'use client'

import { CircleDashed, Clock } from 'lucide-react'
import { OnboardingGuard } from '@/components/app/onboarding-guard'
import { Stepper } from '@/components/app/stepper'
import { setAccessState, useSession } from '@/lib/access'
import { setRejectionReason } from '@/lib/session'

function PendingInner() {
  const { user } = useSession()

  return (
    <div>
      <Stepper current={3} />
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100">
          <Clock className="size-8 text-amber-600" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Pending verification</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Thanks{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! We received your payment screenshot and our team is reviewing it. You&apos;ll
          get an email as soon as your access is approved — usually within a few hours.
        </p>

        <div className="mx-auto mt-7 max-w-sm rounded-xl bg-muted/60 p-4 text-left">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <CircleDashed className="size-3.5" /> Status
          </p>
          <p className="mt-1.5 text-sm font-bold text-foreground">Payment review in progress</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">What happens next: an admin verifies your receipt, then your dashboard unlocks automatically.</p>
        </div>

        <div className="mx-auto mt-7 max-w-sm rounded-xl border border-primary/20 bg-primary/5 p-4 text-left">
          <p className="text-xs font-bold tracking-wide text-primary uppercase">Demo controls</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Simulate the admin decision (in production this happens from the admin panel):</p>
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
              onClick={() => setAccessState('active')}
            >
              Simulate approval
            </button>
            <button
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
              onClick={() => {
                setRejectionReason('The reference number on the receipt does not match your assigned reference. Please double-check and resubmit.')
                setAccessState('rejected')
              }}
            >
              Simulate rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <OnboardingGuard>
      <PendingInner />
    </OnboardingGuard>
  )
}
