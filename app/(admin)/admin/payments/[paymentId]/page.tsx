'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, CircleAlert, CircleCheck, FileImage } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getPayments, subscribePayments, updatePayment } from '@/lib/admin-payments'
import { updateUserAccess } from '@/lib/users-store'
import type { PaymentRecord } from '@/lib/types'

export default function PaymentDetailPage() {
  const params = useParams<{ paymentId: string }>()
  const router = useRouter()
  const [payment, setPayment] = useState<PaymentRecord | null>(null)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setPayment(getPayments().find((p) => p.id === params.paymentId) ?? null)
    sync()
    return subscribePayments(sync)
  }, [params.paymentId])

  if (!payment) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">Payment not found</h1>
        <Link href="/admin/payments" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to payments
        </Link>
      </div>
    )
  }

  const approve = () => {
    updatePayment(payment.id, 'approved')
    // Update user access in users store and global access
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('dp.users')
      if (raw) {
        const users = JSON.parse(raw)
        const userIdx = users.findIndex((u: any) => u.email === payment.userEmail)
        if (userIdx >= 0) {
          users[userIdx].access = 'active'
          window.localStorage.setItem('dp.users', JSON.stringify(users))
          window.dispatchEvent(new Event('dp.users-change'))
        }
        window.localStorage.setItem('dp.access', 'active')
        window.dispatchEvent(new Event('dp.session-change'))
      }
    }
    router.push('/admin/payments')
  }

  const reject = () => {
    if (reason.trim().length < 10) {
      setError('A rejection reason of at least 10 characters is required.')
      return
    }
    updatePayment(payment.id, 'rejected', reason.trim())
    // Update user access in users store and global access
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('dp.users')
      if (raw) {
        const users = JSON.parse(raw)
        const userIdx = users.findIndex((u: any) => u.email === payment.userEmail)
        if (userIdx >= 0) {
          users[userIdx].access = 'rejected'
          window.localStorage.setItem('dp.users', JSON.stringify(users))
          window.dispatchEvent(new Event('dp.users-change'))
        }
        window.localStorage.setItem('dp.access', 'rejected')
        window.dispatchEvent(new Event('dp.session-change'))
      }
    }
    router.push('/admin/payments')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/payments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Payments
      </Link>

      <header className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Payment {payment.reference}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {payment.userName} · {payment.userEmail} · submitted {payment.submittedAt}
          </p>
        </div>
        <Badge variant={payment.status === 'approved' ? 'success' : payment.status === 'rejected' ? 'destructive' : 'warning'} className="capitalize">
          {payment.status}
        </Badge>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Plan', value: payment.plan },
          { label: 'Amount', value: `$${(payment.amount / 100).toFixed(2)}` },
          { label: 'Receipt file', value: payment.receiptName },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 truncate text-sm font-extrabold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="border-b border-border/70 px-5 py-3.5">
          <h2 className="text-sm font-extrabold">Receipt</h2>
        </div>
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 bg-muted/40 p-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <FileImage className="size-6 text-primary" />
          </span>
          <p className="text-sm font-semibold">{payment.receiptName}</p>
          <p className="max-w-xs text-xs leading-5 text-muted-foreground">
            In production the receipt is streamed from Cloudflare R2 via a signed URL, visible only to authorized admins.
          </p>
        </div>
      </section>

      {payment.status === 'pending' && (
        <section className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Decision</h2>
          <div className="mt-4">
            <Label htmlFor="reason">Rejection reason (required only when rejecting)</Label>
            <Textarea id="reason" className="mt-2" placeholder="Explain what the student should fix before resubmitting…" value={reason} onChange={(e) => { setReason(e.target.value); setError(null) }} />
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <CircleAlert className="size-3.5" /> {error}
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button className="h-10 gap-1.5 bg-green-600 px-5 text-sm text-white hover:bg-green-700" onClick={approve}>
              <CircleCheck className="size-4" /> Approve & activate access
            </Button>
            <Button variant="outline" className="h-10 gap-1.5 border-red-200 px-5 text-sm text-red-600 hover:bg-red-50" onClick={reject}>
              <CircleAlert className="size-4" /> Reject with reason
            </Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            On decision, the student is emailed automatically (Resend) and their access state transitions accordingly. Email failure never
            blocks the payment update.
          </p>
        </section>
      )}

      {payment.reason && (
        <section className="mt-4 rounded-2xl bg-red-50 p-5 ring-1 ring-red-100">
          <h2 className="text-sm font-extrabold text-red-700">Rejection reason</h2>
          <p className="mt-1.5 text-sm leading-6 text-red-700">{payment.reason}</p>
        </section>
      )}
    </div>
  )
}
