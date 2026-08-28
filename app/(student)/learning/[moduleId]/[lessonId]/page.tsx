'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Film, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { moduleMeta } from '@/lib/mock-data'
import { useModules } from '@/lib/module-store'
import { cn } from '@/lib/utils'

const readingBody: Record<string, string[]> = {
  default: [
    'Understanding this topic is a core part of your driver\'s license exam. Read the summary below carefully, then answer the related practice questions to reinforce what you have learned.',
    'Key points to remember: always follow posted signs and signals, adjust your speed to the conditions, and stay alert to what other road users might do next. Examiners frequently test these fundamentals.',
    'When you feel confident, mark the lesson as complete and continue to the next one. You can revisit any lesson at any time from the module page.',
  ],
}

export default function LessonPage() {
  const params = useParams<{ moduleId: string; lessonId: string }>()
  const router = useRouter()
  const { modules: allModules } = useModules()
  const mod = allModules.find((m) => m.id === params.moduleId)
  const lessonIndex = mod?.lessons.findIndex((l) => l.id === params.lessonId) ?? -1
  const lesson = lessonIndex >= 0 ? mod?.lessons[lessonIndex] : undefined
  const [completed, setCompleted] = useState(lesson?.completed ?? false)

  if (!mod || !lesson) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="text-xl font-bold">Lesson not found</h1>
        <Link href="/learning" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to learning
        </Link>
      </div>
    )
  }

  const meta = moduleMeta[mod.color]
  const prev = lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : null
  const next = lessonIndex < mod.lessons.length - 1 ? mod.lessons[lessonIndex + 1] : null
  const paragraphs = readingBody.default

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/learning/${mod.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {mod.title}
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', lesson.type === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600')}>
          {lesson.type === 'video' ? <Film className="size-6" /> : <FileText className="size-6" />}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{lesson.title}</h1>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{lesson.type}</Badge>
            <Badge variant={completed ? 'success' : 'warning'}>{completed ? 'Completed' : 'In progress'}</Badge>
          </div>
        </div>
      </header>

      {lesson.type === 'video' ? (
        <div className={cn('mt-6 flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl text-white', meta.solid)}>
          <span className="flex size-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
            <Film className="size-7" />
          </span>
          <p className="text-sm font-semibold">Video lesson · {lesson.duration}</p>
          <p className="max-w-sm px-6 text-center text-xs text-white/70">Video hosting is connected in production (external player embed).</p>
        </div>
      ) : null}

      <article className="mt-6 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <h2 className="text-base font-bold">Lesson summary</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
        <h2 className="mt-6 text-base font-bold">What you need to know</h2>
        <div className="mt-2 flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant={completed ? 'outline' : 'default'}
          className="h-11 px-5 text-sm"
          onClick={() => setCompleted((v) => !v)}
        >
          {completed ? (
            <>
              <CheckCircle2 className="size-4 text-green-600" /> Completed
            </>
          ) : (
            'Mark as complete'
          )}
        </Button>
        <div className="flex gap-2">
          {prev && (
            <Button variant="outline" className="h-11 px-4 text-sm" onClick={() => router.push(`/learning/${mod.id}/${prev.id}`)}>
              <ArrowLeft className="size-4" /> Previous
            </Button>
          )}
          {next && (
            <Button className="h-11 px-4 text-sm" onClick={() => router.push(`/learning/${mod.id}/${next.id}`)}>
              Next lesson <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
