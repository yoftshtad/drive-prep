'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Eye, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getPayments, subscribePayments, updatePayment } from '@/lib/admin-payments'
import type { PaymentRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusMeta: Record<PaymentRecord['status'], { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  approved: { label: 'Approved', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [filter, setFilter] = useState<'all' | PaymentRecord['status']>('all')

  useEffect(() => {
    const sync = () => setPayments(getPayments())
    sync()
    return subscribePayments(sync)
  }, [])

  const filtered = payments.filter((p) => filter === 'all' || p.status === filter)
  const pendingCount = payments.filter((p) => p.status === 'pending').length

  const decide = (id: string, status: PaymentRecord['status']) => {
    updatePayment(id, status, status === 'rejected' ? 'Receipt could not be verified. Please resubmit with a clearer screenshot.' : undefined)
    // Also update the user's access state in users store and global access
    const payment = payments.find(p => p.id === id)
    if (payment && typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('dp.users')
      if (raw) {
        const users = JSON.parse(raw)
        const userIdx = users.findIndex((u: any) => u.email === payment.userEmail)
        if (userIdx >= 0) {
          users[userIdx].access = status === 'approved' ? 'active' : 'rejected'
          window.localStorage.setItem('dp.users', JSON.stringify(users))
          window.dispatchEvent(new Event('dp.users-change'))
        }
      }
      // Also update global access for demo session
      if (status === 'approved') {
        window.localStorage.setItem('dp.access', 'active')
        window.dispatchEvent(new Event('dp.session-change'))
      } else if (status === 'rejected') {
        window.localStorage.setItem('dp.access', 'rejected')
        window.dispatchEvent(new Event('dp.session-change'))
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Payments</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Verify student receipts. Approval activates access; rejection requires a reason so the student can resubmit.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((state) => (
          <button
            key={state}
            onClick={() => setFilter(state)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-colors',
              filter === state ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {state}
            {state === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      <section className="mt-4 rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-5">
                  <p className="font-semibold">{p.userName}</p>
                  <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                </TableCell>
                <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                <TableCell className="font-semibold">${(p.amount / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={statusMeta[p.status].variant}>{statusMeta[p.status].label}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.submittedAt}</TableCell>
                <TableCell className="pr-5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/payments/${p.id}`}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Review payment ${p.reference}`}
                    >
                      <Eye className="size-4" />
                    </Link>
                    {p.status === 'pending' && (
                      <>
                        <button
                          onClick={() => decide(p.id, 'approved')}
                          className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-green-700 transition-colors hover:bg-green-200"
                          aria-label={`Approve payment ${p.reference}`}
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          onClick={() => decide(p.id, 'rejected')}
                          className="flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-colors hover:bg-red-200"
                          aria-label={`Reject payment ${p.reference}`}
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No payments in this view.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
