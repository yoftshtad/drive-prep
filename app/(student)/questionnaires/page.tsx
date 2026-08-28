'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ModuleIcon } from '@/components/student/module-icon'
import { moduleMeta } from '@/lib/mock-data'
import { useModules } from '@/lib/module-store'
import { useQuestionnaires } from '@/lib/questionnaire-store'

export default function QuestionnairesPage() {
  const questionnaires = useQuestionnaires().filter((q) => q.mode === 'practice')
  const { modules } = useModules()

  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Questionnaire</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Practice questions by module with instant feedback and explanations. Questionnaires are independent — jump into any of them.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {questionnaires.map((q) => {
          const mod = modules.find((m) => m.id === q.moduleId)
          const meta = moduleMeta[mod?.color ?? 'purple']
          return (
            <article key={q.id} className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
              <div className="flex items-center gap-3.5">
                <ModuleIcon moduleId={q.moduleId} color={mod?.color ?? 'purple'} className="size-12" />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold tracking-tight">{q.title}</h2>
                  <p className="text-xs text-muted-foreground">Questionnaire</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                <span className={`font-extrabold ${meta.text}`}>{q.questionCount}</span>{' '}
                <span className="font-medium text-muted-foreground">Questions</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pass mark {q.passMark}% · {q.timeLimitMin} min
              </p>
              <Link
                href={`/questionnaires/${q.id}`}
                className={`mt-4 flex h-9 items-center justify-center rounded-lg border bg-card text-sm font-semibold transition-colors hover:bg-muted/50 ${meta.border} ${meta.text}`}
              >
                Start Questions <ChevronRight className="size-4" />
              </Link>
            </article>
          )
        })}
        {questionnaires.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center sm:col-span-2 xl:col-span-4">
            <h2 className="text-base font-bold">No questionnaires yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
              Questionnaires will appear here once your instructor publishes them.
            </p>
          </div>
        )}
      </div>

      <section className="mt-8 rounded-2xl bg-muted/60 p-6">
        <h2 className="text-base font-extrabold">How practice mode works</h2>
        <div className="mt-3 grid gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <p>Each answer is graded instantly — correct answers turn green, and every question includes a clear explanation so you learn as you go.</p>
          <p>Your results are recorded so you can track accuracy and weak categories on the Performance page. Bookmark tricky questions to revisit later.</p>
        </div>
      </section>
    </div>
  )
}
