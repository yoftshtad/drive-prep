'use client'

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const signups = [
  { week: 'W1', students: 42, paid: 31 },
  { week: 'W2', students: 55, paid: 44 },
  { week: 'W3', students: 61, paid: 52 },
  { week: 'W4', students: 74, paid: 63 },
  { week: 'W5', students: 88, paid: 76 },
  { week: 'W6', students: 96, paid: 84 },
]

const missed = [
  { question: 'Parking distance from fire hydrant', rate: 46 },
  { question: 'Hydroplaning response', rate: 41 },
  { question: 'Flashing red light meaning', rate: 33 },
  { question: 'ABS steering while braking', rate: 29 },
  { question: 'Right of way at 4-way stop', rate: 24 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Analytics</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Platform-wide trends computed with SQL aggregation (no ML needed for the MVP).</p>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Signups vs paid conversions</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signups} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="students" name="Signups" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="paid" name="Paid" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="text-base font-extrabold">Most commonly missed questions</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missed} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="question" width={150} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                <Bar dataKey="rate" name="Miss rate" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Activation rate', value: '86%', note: 'paid / registered students' },
          { label: 'Avg attempts / student', value: '14.4', note: 'last 30 days' },
          { label: 'Avg mock score', value: '73%', note: 'pass mark 70%' },
          { label: 'Avg verification time', value: '2.1h', note: 'receipt submitted → decision' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-extrabold">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
