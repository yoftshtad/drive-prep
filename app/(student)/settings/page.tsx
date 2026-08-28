'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', on ? 'bg-primary' : 'bg-border')}
    >
      <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-5.5' : 'left-0.5')} />
    </button>
  )
}

const notificationPrefs = [
  { label: 'Payment updates', desc: 'Approval, rejection and receipt-received emails.' },
  { label: 'Study reminders', desc: 'A gentle nudge to keep your streak going.' },
  { label: 'New content', desc: 'Alerts when new lessons or questions are added.' },
  { label: 'Product updates', desc: 'Occasional news about DrivePrep features.' },
]

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Manage notifications, security and preferences.</p>
      </header>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="border-b border-border/70 p-5">
          <h2 className="text-base font-extrabold">Notifications</h2>
        </div>
        <div className="divide-y divide-border/70">
          {notificationPrefs.map((pref, i) => (
            <div key={pref.label} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-bold">{pref.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Toggle defaultOn={i < 2} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <h2 className="text-base font-extrabold">Change password</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" placeholder="Min. 8 characters" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="h-10 px-5 text-sm">
              Update password
            </Button>
            {saved && (
              <span className="ml-3 inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                <Check className="size-4" /> Password updated.
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
