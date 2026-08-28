'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, CircleHelp, Clock3, ListChecks, Target } from 'lucide-react'
import { ModuleIcon } from '@/components/student/module-icon'
import { Button } from '@/components/ui/button'
import { setQuizSession } from '@/lib/quiz-session'
import { moduleMeta } from '@/lib/mock-data'
import { useModules } from '@/lib/module-store'
import { useQuestionnaires } from '@/lib/questionnaire-store'
import { useQuestions } from '@/lib/question-store'
import { shuffled } from '@/lib/mock-data'

export default function QuestionnaireIntroPage() {
  const params = useParams<{ questionnaireId: string }>()
  const router = useRouter()
  const questionnaires = useQuestionnaires()
  const { modules } = useModules()
  const allQuestions = useQuestions()

  const questionnaire = questionnaires.find((q) => q.id === params.questionnaireId)
  const mod = modules.find((m) => m.id === questionnaire?.moduleId)
  const pool = questionnaire ? allQuestions.filter((q) => q.moduleId === questionnaire.moduleId) : []

  if (!questionnaire) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">Questionnaire not found</h1>
        <Link href="/questionnaires" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to questionnaires
        </Link>
      </div>
    )
  }

  const meta = moduleMeta[mod?.color ?? 'purple']

  const start = () => {
    if (pool.length === 0) return
    setQuizSession({
      key: questionnaire.id,
      title: `${questionnaire.title} Questionnaire`,
      mode: 'practice',
      passMark: questionnaire.passMark,
      timeLimitMin: questionnaire.timeLimitMin,
      resultsPath: `/questionnaires/${questionnaire.id}/results`,
      introPath: `/questionnaires/${questionnaire.id}`,
      questions: shuffled(pool),
    })
    router.push(`/questionnaires/${questionnaire.id}/question/1`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/questionnaires" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Questionnaires
      </Link>

      <header className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)] sm:p-8">
        <div className="flex items-center gap-4">
          <ModuleIcon moduleId={questionnaire.moduleId} color={mod?.color ?? 'purple'} className="size-16" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{questionnaire.title}</h1>
            <p className="text-sm text-muted-foreground">{questionnaire.description}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: ListChecks, label: 'Questions', value: String(pool.length) },
            { icon: Target, label: 'Pass mark', value: `${questionnaire.passMark}%` },
            { icon: Clock3, label: 'Time limit', value: `${questionnaire.timeLimitMin} min` },
            { icon: BookOpen, label: 'Mode', value: 'Practice' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-muted/60 p-3.5 text-center">
              <Icon className={`mx-auto size-5 ${meta.text}`} />
              <dt className="mt-1.5 text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-extrabold">{value}</dd>
            </div>
          ))}
        </dl>

        {pool.length === 0 ? (
          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 ring-1 ring-amber-100">
            No questions have been added for this questionnaire yet. Please check back later.
          </p>
        ) : (
          <div className="mt-6 flex gap-3 rounded-xl bg-primary/5 p-4 text-sm leading-6 ring-1 ring-primary/10">
            <CircleHelp className="mt-0.5 size-4.5 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              You get instant feedback after each answer with a full explanation. You can bookmark questions and review everything at the end.
              Good luck!
            </p>
          </div>
        )}

        <Button size="lg" className="mt-6 h-12 w-full text-sm" onClick={start} disabled={pool.length === 0}>
          Start questionnaire
        </Button>
      </header>
    </div>
  )
}
