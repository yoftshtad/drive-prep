'use client'

import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, CircleAlert, ClipboardCheck, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const stats = [
  { icon: Users, label: 'Total students', value: '1,284', delta: '+38 this week', tone: 'bg-blue-50 text-blue-600' },
  { icon: ClipboardCheck, label: 'Active access', value: '1,102', delta: '86% activation', tone: 'bg-green-50 text-green-600' },
  { icon: CircleAlert, label: 'Pending payments', value: '2', delta: 'Needs review', tone: 'bg-amber-50 text-amber-600' },
  { icon: BookOpen, label: 'Question attempts', value: '18,540', delta: '+1,240 this week', tone: 'bg-purple-50 text-purple-600' },
]

const pending = [
  { id: 'pay-1041', name: 'Maria Santos', email: 'maria@example.com', submitted: 'Aug 14, 2026', receipt: 'gcash-screenshot.png' },
  { id: 'pay-1040', name: 'Ahmed Karim', email: 'ahmed@example.com', submitted: 'Aug 15, 2026', receipt: 'bank-transfer.jpg' },
]

const scoreData = [
  { module: 'Traffic Signs', avg: 78 },
  { module: 'Road Rules', avg: 71 },
  { module: 'Defensive Driving', avg: 74 },
  { module: 'Vehicle Knowledge', avg: 66 },
]

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Overview of students, payments and content health.</p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, delta, tone }) => (
          <div key={label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
            <div className="flex items-center justify-between">
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold">{value}</p>
            <p className="mt-0.5 text-sm font-semibold">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <div className="flex items-center justify-between p-5 pb-2">
            <h2 className="text-base font-extrabold">Payments awaiting verification</h2>
            <Link href="/admin/payments" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Student</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="pr-5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-5">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.submitted}</TableCell>
                  <TableCell className="max-w-40 truncate text-muted-foreground">{p.receipt}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <Link href={`/admin/payments/${p.id}`} className="text-sm font-semibold text-primary hover:underline">
                      Review
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Average score by module</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="module" width={110} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                <Bar dataKey="avg" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-muted/60 p-6">
        <h2 className="text-base font-extrabold">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Link href="/admin/payments" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Verify pending payments
          </Link>
          <Link href="/admin/questions/new" className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
            Add question
          </Link>
          <Link href="/admin/questions/import" className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
            Import from Excel
          </Link>
          <Link href="/admin/questionnaires/new" className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
            Create questionnaire
          </Link>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="warning">MVP</Badge> Payments are verified manually — approve only after checking the receipt against the transfer records.
        </p>
      </section>
    </div>
  )
}
