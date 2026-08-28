'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CircleCheck, CircleX, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getLastAttempt, type LastAttempt } from '@/lib/attempt-store'
import { useQuestions } from '@/lib/question-store'
import { formatTime } from '@/lib/grading'
import { cn } from '@/lib/utils'

export function ResultsView({ retakePath, listPath, listLabel = 'Back' }: { retakePath: string; listPath: string; listLabel?: string }) {
  const [attempt, setAttempt] = useState<LastAttempt | null>(null)
  const [loaded, setLoaded] = useState(false)
  const allQuestions = useQuestions()

  useEffect(() => {
    setAttempt(getLastAttempt())
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" aria-label="Loading" />
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">No results yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete a questionnaire or mock test to see your results here.</p>
        <Button className="mt-6 h-11 px-5 text-sm" render={<Link href={listPath} />}>
          {listLabel}
        </Button>
      </div>
    )
  }

  const wrong = attempt.answers.filter((a) => !a.correct)

  return (
    <div className="mx-auto max-w-3xl">
      <header className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-[0_1px_3px_rgb(16_24_40/0.05)] sm:p-8">
        <span className={cn('mx-auto flex size-16 items-center justify-center rounded-full', attempt.passed ? 'bg-green-100' : 'bg-red-100')}>
          {attempt.passed ? <CircleCheck className="size-8 text-green-600" /> : <CircleX className="size-8 text-red-600" />}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{attempt.passed ? 'Congratulations — you passed!' : 'Not passed this time'}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{attempt.title}</p>

        <div className="mx-auto mt-6 flex max-w-lg items-center gap-5">
          <div className="relative flex size-28 shrink-0 items-center justify-center">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(attempt.percent / 100) * 264} 264`}
                className={attempt.passed ? 'text-green-600' : 'text-red-500'}
              />
            </svg>
            <span className="absolute text-xl font-extrabold">{attempt.percent}%</span>
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-3 text-left">
            <div className="rounded-xl bg-muted/60 p-3">
              <dt className="text-xs text-muted-foreground">Score</dt>
              <dd className="mt-0.5 text-lg font-extrabold">
                {attempt.score}/{attempt.total}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <dt className="text-xs text-muted-foreground">Pass mark</dt>
              <dd className="mt-0.5 text-lg font-extrabold">{attempt.passMark}%</dd>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <dt className="text-xs text-muted-foreground">Time spent</dt>
              <dd className="mt-0.5 text-lg font-extrabold">{formatTime(attempt.timeSpentSec)}</dd>
            </div>
            <div className="rounded-xl bg-muted/60 p-3">
              <dt className="text-xs text-muted-foreground">Mistakes</dt>
              <dd className="mt-0.5 text-lg font-extrabold text-red-600">{wrong.length}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button className="h-11 px-5 text-sm" render={<Link href={retakePath} />}>
            <RotateCcw className="size-4" /> Retake
          </Button>
          <Button variant="outline" className="h-11 px-5 text-sm" render={<Link href={listPath} />}>
            {listLabel}
          </Button>
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-lg font-extrabold tracking-tight">Review your answers</h2>
        <div className="mt-3 flex flex-col gap-3">
          {attempt.answers.map((answer, i) => {
            const question = allQuestions.find((q) => q.id === answer.questionId)
            if (!question) return null
            return (
              <article key={answer.questionId} className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-6 font-bold">
                    {i + 1}. {question.text}
                  </p>
                  {answer.correct ? <CircleCheck className="size-5 shrink-0 text-green-600" /> : <CircleX className="size-5 shrink-0 text-red-500" />}
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-sm">
                  {question.options.map((option, oi) => {
                    const chosen = answer.selected.includes(oi)
                    const correct = question.correct.includes(oi)
                    return (
                      <p
                        key={oi}
                        className={cn(
                          'rounded-lg px-3 py-2',
                          correct && 'bg-green-50 font-semibold text-green-800',
                          chosen && !correct && 'bg-red-50 font-semibold text-red-700',
                          !chosen && !correct && 'text-muted-foreground',
                        )}
                      >
                        {String.fromCharCode(65 + oi)}. {option}
                        {correct && ' ✓'}
                        {chosen && !correct && ' ✗'}
                      </p>
                    )
                  })}
                </div>
                {!answer.correct && (
                  <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-sm leading-6 text-muted-foreground">
                    <span className="font-bold text-foreground">Explanation: </span>
                    {question.explanation}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
