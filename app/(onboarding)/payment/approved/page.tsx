'use client'

import { useRouter } from 'next/navigation'
import { CircleCheck } from 'lucide-react'
import { OnboardingGuard } from '@/components/app/onboarding-guard'
import { Stepper } from '@/components/app/stepper'
import { Button } from '@/components/ui/button'

function ApprovedInner() {
  const router = useRouter()
  return (
    <div>
      <Stepper current={4} />
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
          <CircleCheck className="size-8 text-green-600" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Payment approved!</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Welcome to Premium Access. All four modules, questionnaires, mock tests and performance tracking are now unlocked for your account.
        </p>
        <div className="mx-auto mt-7 flex max-w-xs flex-col gap-2.5">
          <Button size="lg" className="h-12 w-full text-sm" onClick={() => router.push('/dashboard')}>
            Go to dashboard
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full text-sm" onClick={() => router.push('/learning')}>
            Browse learning modules
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentApprovedPage() {
  return (
    <OnboardingGuard>
      <ApprovedInner />
    </OnboardingGuard>
  )
}
