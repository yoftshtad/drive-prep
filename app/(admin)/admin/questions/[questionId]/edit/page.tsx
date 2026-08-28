'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { QuestionForm } from '@/components/admin/question-form'
import { updateQuestion, useQuestions } from '@/lib/question-store'

export default function EditQuestionPage() {
  const params = useParams<{ questionId: string }>()
  const questions = useQuestions()
  const question = questions.find((q) => q.id === params.questionId)

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">Question not found</h1>
        <Link href="/admin/questions" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to questions
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/questions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Questions
      </Link>
      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Edit question</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">ID: {question.id}</p>
      </header>
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <QuestionForm
          submitLabel="Save changes"
          initial={{
            moduleId: question.moduleId,
            type: question.type,
            text: question.text,
            options: question.options.length === 4 ? question.options : [...question.options, '', '', '', ''].slice(0, 4),
            correct: question.correct[0] ?? 0,
            difficulty: question.difficulty,
            explanation: question.explanation,
            image: '',
          }}
          onSubmit={(values) =>
            updateQuestion(question.id, {
              moduleId: values.moduleId,
              type: values.type,
              text: values.text.trim(),
              options: values.type === 'truefalse' ? ['True', 'False'] : values.options.map((o) => o.trim()).filter(Boolean),
              correct: [values.correct],
              difficulty: values.difficulty,
              explanation: values.explanation.trim(),
            })
          }
        />
      </div>
    </div>
  )
}
