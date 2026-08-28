'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from '@/lib/access'
import { initials } from '@/lib/session'

export default function ProfilePage() {
  const { user } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Profile</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Your account information and membership.</p>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <span className="flex size-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-extrabold text-teal-700">
          {initials(name || 'John Doe')}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold">{name || 'Student'}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-purple-700">
            <BadgeCheck className="size-4" /> Premium Member
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <h2 className="text-base font-extrabold">Personal information</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              <User className="mr-1.5 inline size-3.5 text-muted-foreground" /> Full name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">
              <Mail className="mr-1.5 inline size-3.5 text-muted-foreground" /> Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="h-10 px-5 text-sm">
              Save changes
            </Button>
            {saved && <span className="ml-3 text-sm font-semibold text-green-600">Profile updated.</span>}
          </div>
        </form>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Member since', value: 'Aug 2026' },
          { label: 'Plan', value: 'Premium — lifetime' },
          { label: 'Student ID', value: 'DP-2026-0142' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-extrabold">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
