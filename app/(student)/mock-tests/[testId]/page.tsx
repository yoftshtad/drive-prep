'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, CircleAlert, Clock3, ListChecks, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { setQuizSession } from '@/lib/quiz-session'
import { useQuestionnaires } from '@/lib/questionnaire-store'
import { useQuestions } from '@/lib/question-store'
import { shuffled } from '@/lib/mock-data'

export default function MockTestIntroPage() {
  const params = useParams<{ testId: string }>()
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const questionnaires = useQuestionnaires()
  const allQuestions = useQuestions()

  const test = questionnaires.find((t) => t.id === params.testId && t.mode === 'mock')
  const pool = test ? allQuestions.filter((q) => test.moduleId === 'random' || q.moduleId === test.moduleId) : []

  if (!test) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">Mock test not found</h1>
        <Link href="/mock-tests" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to mock tests
        </Link>
      </div>
    )
  }

  const start = () => {
    if (!confirmed || pool.length === 0) return
    setQuizSession({
      key: test.id,
      title: test.title,
      mode: 'mock',
      passMark: test.passMark,
      timeLimitMin: test.timeLimitMin,
      resultsPath: `/mock-tests/${test.id}/results`,
      introPath: `/mock-tests/${test.id}`,
      questions: shuffled(pool).slice(0, Math.min(test.questionCount, pool.length)),
    })
    router.push(`/mock-tests/${test.id}/question/1`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/mock-tests" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Mock tests
      </Link>

      <header className="mt-4 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)] sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">{test.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{test.description}</p>

        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: ListChecks, label: 'Questions', value: String(Math.min(test.questionCount, pool.length)) },
            { icon: Clock3, label: 'Time limit', value: `${test.timeLimitMin} min` },
            { icon: Target, label: 'Pass mark', value: `${test.passMark}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-muted/60 p-3.5 text-center">
              <Icon className="mx-auto size-5 text-primary" />
              <dt className="mt-1.5 text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-extrabold">{value}</dd>
            </div>
          ))}
        </dl>

        {pool.length === 0 ? (
          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 ring-1 ring-amber-100">
            No questions are available for this test yet. Please check back later.
          </p>
        ) : (
          <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 ring-1 ring-amber-100">
            <CircleAlert className="mt-0.5 size-4.5 shrink-0 text-amber-600" />
            <p className="text-amber-800">
              This is a timed, exam-condition simulation. Once you start, the timer runs continuously and your answers are graded only when you
              submit (or when time runs out).
            </p>
          </div>
        )}

        <div className="mt-6 flex items-start gap-3">
          <input
            id="confirm-rules"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-input accent-[var(--primary)]"
          />
          <Label htmlFor="confirm-rules" className="text-sm leading-6 font-normal text-muted-foreground">
            I understand the test is timed and feedback is only shown after submission.
          </Label>
        </div>

        <Button size="lg" disabled={!confirmed || pool.length === 0} className="mt-5 h-12 w-full text-sm" onClick={start}>
          Start mock test
        </Button>
      </header>
    </div>
  )
}
