'use client'

import Link from 'next/link'
import { CircleAlert, RotateCcw } from 'lucide-react'
import { OnboardingGuard } from '@/components/app/onboarding-guard'
import { Stepper } from '@/components/app/stepper'
import { useSession } from '@/lib/access'
import { getRejectionReason } from '@/lib/session'

function RejectedInner() {
  const { access } = useSession()
  const reason = access === 'rejected' ? getRejectionReason() : null

  return (
    <div>
      <Stepper current={3} />
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
          <CircleAlert className="size-8 text-red-600" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Payment rejected</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Unfortunately we could not verify your payment. You can resubmit a new screenshot at any time.
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-xl bg-red-50 p-4 text-left ring-1 ring-red-100">
          <p className="text-xs font-bold tracking-wide text-red-700 uppercase">Reason</p>
          <p className="mt-1.5 text-sm leading-6 text-red-700">{reason ?? 'Your latest submission was rejected. Check the reason and resubmit.'}</p>
        </div>

        <div className="mx-auto mt-7 flex max-w-xs flex-col gap-2.5">
          <Link
            href="/payment/upload"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="size-4" /> Resubmit screenshot
          </Link>
          <Link href="/payment" className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Review payment instructions
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentRejectedPage() {
  return (
    <OnboardingGuard>
      <RejectedInner />
    </OnboardingGuard>
  )
}
