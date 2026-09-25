'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, ChartPie, ClipboardList, CreditCard, LayoutDashboard, ListChecks, LogOut, Menu, Upload, Users, X,
} from 'lucide-react'
import { DrivePrepLogo } from './logo'
import { initials, signOut } from '@/lib/session'
import { useSession } from '@/lib/access'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/modules', label: 'Modules', icon: BookOpen },
  { href: '/admin/questions', label: 'Questions', icon: ListChecks },
  { href: '/admin/questionnaires', label: 'Questionnaires', icon: ClipboardList },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartPie },
]

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground/70 hover:bg-muted hover:text-foreground',
            )}
          >
            {active && <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" aria-hidden />}
            <Icon className="size-4.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useSession()
  const router = useRouter()
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!user) router.replace('/login')
    else if (user.role !== 'admin') router.replace('/dashboard')
  }, [ready, user, router])

  if (!ready || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card">
        <div className="flex h-18 items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <DrivePrepLogo />
            <Badge className="ml-1 hidden sm:inline-flex">Admin</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Student view
            </Link>
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {initials(user.name)}
            </span>
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => {
                signOut()
                router.push('/login')
              }}
              aria-label="Log out"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-18 hidden h-[calc(100vh-4.5rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-border/70 bg-card p-4 lg:flex">
          <AdminNav />
          <div className="mt-auto pt-4">
            <Link
              href="/admin/questions/import"
              className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-card px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              <Upload className="size-4" /> Import questions
            </Link>
          </div>
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-border/70 p-4">
                <DrivePrepLogo tagline={false} />
                <button className="rounded-lg p-2 hover:bg-muted" onClick={() => setDrawer(false)} aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <AdminNav onNavigate={() => setDrawer(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
