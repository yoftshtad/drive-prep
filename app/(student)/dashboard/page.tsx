'use client'

import Link from 'next/link'
import { ArrowRight, Award, BookOpen, ChartColumn, ChevronRight, ClipboardCheck, ClipboardList, Target } from 'lucide-react'
import { ModuleIcon } from '@/components/student/module-icon'
import { Progress } from '@/components/ui/progress'
import { moduleMeta } from '@/lib/mock-data'
import { useModules } from '@/lib/module-store'
import { useProgressMap } from '@/lib/progress-store'
import { useSession } from '@/lib/access'

const highlights = [
  { icon: Target, title: 'Practice Anytime', text: 'Access questions anytime, anywhere.' },
  { icon: ChartColumn, title: 'Track Progress', text: 'Monitor your performance and improvement.' },
  { icon: ClipboardCheck, title: 'Mock Tests', text: 'Simulate real exam conditions.' },
  { icon: Award, title: 'Get Certified', text: 'Be confident and pass your official exam.' },
]

export default function DashboardPage() {
  const { user } = useSession()
  const { modules } = useModules()
  const progressMap = useProgressMap()

  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {user?.name.split(' ')[0] ?? 'John'}!</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Let&apos;s continue your journey towards getting your driver&apos;s license.</p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="flex items-center gap-5 rounded-2xl bg-purple-50 p-5 sm:p-7">
          <span className="hidden size-24 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm sm:flex">
            <ClipboardList className="size-12 text-violet-600" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-purple-700 sm:text-2xl">Jump into Questions</h2>
            <p className="mt-1.5 text-sm leading-6 text-foreground/70">Skip learning and start practicing right away with our question bank.</p>
            <Link
              href="/practice"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-purple-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-purple-800"
            >
              Start Practicing <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-2xl bg-green-50 p-5 sm:p-7">
          <span className="hidden size-24 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm sm:flex">
            <BookOpen className="size-12 text-green-600" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-green-700 sm:text-2xl">Continue Learning</h2>
            <p className="mt-1.5 text-sm leading-6 text-foreground/70">Learn at your own pace with our structured modules and videos.</p>
            <Link
              href="/learning"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Browse Learning <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">Learning Modules</h2>
          <Link href="/learning" className="flex items-center gap-1 text-sm font-bold text-purple-700 hover:underline">
            View All Modules <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => {
            const meta = moduleMeta[mod.color]
            const progress = progressMap[mod.id]?.percent ?? mod.progress
            return (
              <article key={mod.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
                <div className="flex items-start justify-between">
                  <ModuleIcon moduleId={mod.id} color={mod.color} />
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">Module {mod.order}</p>
                <h3 className="text-base font-bold tracking-tight">{mod.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{mod.description}</p>
                <div className="mt-4">
                  <Progress value={progress} indicatorClassName={meta.bar} className="h-2" />
                  <p className={`mt-2 text-xs font-bold ${meta.text}`}>{progress}% Complete</p>
                </div>
                <Link
                  href={`/learning/${mod.id}`}
                  className={`mt-4 flex h-9 items-center justify-center rounded-lg border bg-card text-sm font-semibold transition-colors hover:bg-muted/50 ${meta.border} ${meta.text}`}
                >
                  {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">Questionnaire by Module</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => {
            const meta = moduleMeta[mod.color]
            return (
              <article key={mod.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
                <div className="flex items-center gap-3.5">
                  <ModuleIcon moduleId={mod.id} color={mod.color} className="size-12" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold tracking-tight">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground">Questionnaire</p>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  <span className={`font-extrabold ${meta.text}`}>{mod.questionCount}</span>{' '}
                  <span className="font-medium text-muted-foreground">Questions</span>
                </p>
                <Link
                  href={`/questionnaires/${mod.id}`}
                  className={`mt-4 flex h-9 items-center justify-center rounded-lg border bg-card text-sm font-semibold transition-colors hover:bg-muted/50 ${meta.border} ${meta.text}`}
                >
                  Start Questions
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-6 rounded-2xl bg-blue-50 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Icon className="size-5.5 text-blue-600" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-blue-900">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-blue-900/60">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
