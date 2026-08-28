'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Target, TrendingUp, ClipboardCheck, CircleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAttempts } from '@/lib/attempt-store'
import type { AttemptRecord } from '@/lib/types'

export default function PerformancePage() {
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])

  useEffect(() => {
    setAttempts(getAttempts())
  }, [])

  const totalQ = attempts.reduce((acc, a) => acc + a.total, 0)
  const totalCorrect = attempts.reduce((acc, a) => acc + a.score, 0)
  const accuracy = totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0
  const avgScore = attempts.length ? Math.round(attempts.reduce((acc, a) => acc + a.percent, 0) / attempts.length) : 0
  const mocks = attempts.filter((a) => a.mode === 'mock')
  const mockPassRate = mocks.length ? Math.round((mocks.filter((a) => a.passed).length / mocks.length) * 100) : 0
  const weakCategories = [...new Set(attempts.flatMap((a) => a.weakCategories))].slice(0, 4)

  const chartData = [...attempts]
    .reverse()
    .slice(-8)
    .map((a) => ({ name: a.questionnaireTitle.replace('Mock Test', 'Mock'), score: a.percent }))

  const stats = [
    { icon: Target, label: 'Overall accuracy', value: `${accuracy}%`, tone: 'text-blue-600 bg-blue-50' },
    { icon: TrendingUp, label: 'Average score', value: `${avgScore}%`, tone: 'text-green-600 bg-green-50' },
    { icon: ClipboardCheck, label: 'Mock pass rate', value: `${mockPassRate}%`, tone: 'text-purple-600 bg-purple-50' },
    { icon: CircleAlert, label: 'Total attempts', value: String(attempts.length), tone: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Performance</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Monitor your accuracy, scores and improvement over time.</p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
            <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="size-5.5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-extrabold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Score by attempt</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.score >= 70 ? 'var(--color-green-600, #16a34a)' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Categories to improve</h2>
          {weakCategories.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No weak categories detected yet. Keep practicing!</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2.5">
              {weakCategories.map((cat) => (
                <li key={cat} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {cat}
                  <Badge variant="warning">Review</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link href="/practice" className="mt-5 flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Practice weak areas
          </Link>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-base font-extrabold">Recent results</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Questionnaire</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="pr-5 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.slice(0, 8).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="pl-5 font-semibold">{a.questionnaireTitle}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {a.mode}
                  </Badge>
                </TableCell>
                <TableCell>
                  {a.score}/{a.total} ({a.percent}%)
                </TableCell>
                <TableCell>
                  <Badge variant={a.passed ? 'success' : 'destructive'}>{a.passed ? 'Passed' : 'Failed'}</Badge>
                </TableCell>
                <TableCell className="pr-5 text-right text-muted-foreground">{a.completedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
