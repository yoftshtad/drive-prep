'use client'

import Link from 'next/link'
import { CheckCircle2, CircleAlert, Clock3, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const history = [
  { id: 'DP-88371', plan: 'Premium Access — lifetime', amount: '$25.00', status: 'approved' as const, date: 'Aug 12, 2026', reference: 'Secure Bank Corp ····8910' },
]

const statusMeta = {
  approved: { label: 'Approved', variant: 'success' as const, icon: CheckCircle2 },
  pending: { label: 'Pending', variant: 'warning' as const, icon: Clock3 },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: CircleAlert },
}

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Payments</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Manage your plan and review your payment history.</p>
      </header>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[linear-gradient(135deg,#5b21b6,#7c3aed)] p-6 text-white sm:p-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            <Crown className="size-5 text-amber-300" fill="currentColor" /> Premium Access
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
            Full access to all 4 modules, 450+ practice questions, mock tests and performance tracking. One-time payment, lifetime access.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold">$25</p>
          <Badge className="mt-2 border-white/20 bg-white/15 text-white">Active</Badge>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-base font-extrabold">Payment history</h2>
          <Link href="/payment" className="text-sm font-semibold text-primary hover:underline">
            New payment
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Reference</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((p) => {
              const meta = statusMeta[p.status]
              return (
                <TableRow key={p.id}>
                  <TableCell className="pl-5 font-mono text-xs font-semibold">{p.id}</TableCell>
                  <TableCell>
                    <p className="font-semibold">{p.plan}</p>
                    <p className="text-xs text-muted-foreground">{p.reference}</p>
                  </TableCell>
                  <TableCell className="font-semibold">{p.amount}</TableCell>
                  <TableCell>
                    <Badge variant={meta.variant} className="gap-1">
                      <meta.icon className="size-3" /> {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </section>

      <section className="mt-6 rounded-2xl bg-muted/60 p-6 text-sm leading-6 text-muted-foreground">
        <h2 className="text-base font-extrabold text-foreground">How manual verification works</h2>
        <p className="mt-2">
          Payments are verified manually: you send the transfer, upload a screenshot of the receipt, and an administrator approves it. Your
          access activates immediately after approval and you receive a confirmation email.
        </p>
      </section>
    </div>
  )
}
