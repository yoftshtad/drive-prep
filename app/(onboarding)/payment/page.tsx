'use client'

import Link from 'next/link'
import { ArrowRight, Banknote, Building2, Hash, User } from 'lucide-react'
import { OnboardingGuard } from '@/components/app/onboarding-guard'
import { Stepper } from '@/components/app/stepper'
import { useSession } from '@/lib/access'

const details = [
  { icon: Building2, label: 'Bank', value: 'Secure Bank Corp' },
  { icon: User, label: 'Account name', value: 'DrivePrep Learning Inc.' },
  { icon: Hash, label: 'Account number', value: '0123 4567 8910' },
  { icon: Banknote, label: 'Amount', value: '$25.00 USD' },
]

export default function PaymentInstructionsPage() {
  return (
    <OnboardingGuard>
      <PaymentInstructions />
    </OnboardingGuard>
  )
}

function PaymentInstructions() {
  const { user } = useSession()
  const reference = `DP-${(user?.id ?? 'guest').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6)}`

  return (
    <div>
      <Stepper current={1} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment instructions</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Unlock full access to all modules, questionnaires and mock tests with a one-time payment. Your access is activated after an
          administrator verifies your payment receipt — usually within a few hours.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="flex items-center justify-between bg-primary/5 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-primary">Premium Access</p>
            <p className="text-xs text-muted-foreground">One-time payment · Lifetime access</p>
          </div>
          <p className="text-2xl font-extrabold text-primary">$25</p>
        </div>
        <dl className="divide-y divide-border/70">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="size-4" /> {label}
              </dt>
              <dd className="text-sm font-bold text-foreground select-all">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 px-5 py-3.5">
            <dt className="text-sm text-muted-foreground">Payment reference</dt>
            <dd className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground select-all">{reference}</dd>
          </div>
        </dl>
      </div>

      <ol className="mt-6 flex flex-col gap-3 rounded-2xl bg-muted/60 p-5 text-sm leading-6 text-muted-foreground">
        {[
          'Send exactly $25.00 to the account above using your banking app.',
          `Include the reference "${reference}" in your transfer so we can match your payment.`,
          'Take a clear screenshot of the successful payment receipt.',
          'Upload the screenshot and wait for verification — you will be notified by email.',
        ].map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <Link
        href="/payment/upload"
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        I&apos;ve sent the payment — upload screenshot <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
