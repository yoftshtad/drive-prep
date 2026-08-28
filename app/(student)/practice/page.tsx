'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuizRunner } from '@/components/student/quiz-runner'
import { setQuizSession, getQuizSession } from '@/lib/quiz-session'
import { useQuestions } from '@/lib/question-store'
import { shuffled } from '@/lib/mock-data'

export default function PracticePage() {
  const router = useRouter()
  const allQuestions = useQuestions()

  useEffect(() => {
    const existing = getQuizSession()
    if (existing && existing.key === 'random-practice') return
    if (allQuestions.length === 0) return
    setQuizSession({
      key: 'random-practice',
      title: 'Random Practice',
      mode: 'practice',
      passMark: 70,
      timeLimitMin: 0,
      resultsPath: '/practice/results',
      introPath: '/practice',
      questions: shuffled(allQuestions),
    })
  }, [router, allQuestions])

  if (allQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">No questions available</h1>
        <p className="mt-2 text-sm text-muted-foreground">The question bank is empty. Please check back later.</p>
      </div>
    )
  }

  return <QuizRunner />
}
