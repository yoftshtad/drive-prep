'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { estimateReadingMinutes } from '@/lib/pdf-extract'
import { getModuleProgress, saveReadingProgress } from '@/lib/progress-store'
import type { LearningModule } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ReadingView({ module: mod, nextModule }: { module: LearningModule; nextModule?: LearningModule }) {
  const articleRef = useRef<HTMLElement>(null)
  const percentRef = useRef(0)
  const [percent, setPercent] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [restored, setRestored] = useState(false)
  const lastSaved = useRef(0)
  const minutes = mod.content ? estimateReadingMinutes(mod.content.words) : 0

  useEffect(() => {
    const saved = getModuleProgress(mod.id)
    if (saved) {
      setPercent(saved.percent)
      setCompleted(saved.completed)
    }
    setRestored(true)
  }, [mod.id])

  const measure = useCallback(() => {
    const el = articleRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const total = rect.height - window.innerHeight + 96
    const scrolled = Math.min(Math.max(-rect.top + 96, 0), Math.max(total, 1))
    const pct = Math.round((scrolled / Math.max(total, 1)) * 100)
    setPercent(pct)
    const now = Date.now()
    if (now - lastSaved.current > 800) {
      lastSaved.current = now
      saveReadingProgress(mod.id, pct)
    }
  }, [mod.id])

  useEffect(() => {
    if (!restored) return
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    measure()
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      saveReadingProgress(mod.id, percentRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored, measure, mod.id])

  useEffect(() => {
    percentRef.current = percent
    if (percent >= 95 && !completed) {
      setCompleted(true)
      saveReadingProgress(mod.id, 100, true)
    }
  }, [percent, completed, mod.id])

  const markComplete = () => {
    setCompleted(true)
    setPercent(100)
    saveReadingProgress(mod.id, 100, true)
  }

  return (
    <div>
      <div className="sticky top-18 z-30 -mx-4 mb-8 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${percent}%` }} />
          </div>
          <span className="w-16 text-right text-xs font-bold text-muted-foreground">{percent}% read</span>
        </div>
      </div>

      <article ref={articleRef} className="mx-auto max-w-3xl">
        <Link href="/learning" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All modules
        </Link>

        <header className="mt-5">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Module {mod.order}</p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">{mod.title}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{mod.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border/70 py-3 text-xs font-semibold text-muted-foreground">
            {mod.content && (
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5" /> {mod.content.pages} pages
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" /> {minutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" /> {completed ? 'Completed' : percent > 0 ? `${percent}% read` : 'Not started'}
            </span>
          </div>
        </header>

        {mod.content?.sections.map((section, si) => (
          <section key={si} className="mt-10">
            <h2 className="text-xl font-extrabold tracking-tight text-balance sm:text-2xl">{section.heading}</h2>
            <div className="mt-4 flex flex-col gap-5">
              {section.paragraphs.map((paragraph, pi) => (
                <p
                  key={pi}
                  className={cn(
                    'text-[15.5px] leading-8 text-foreground/80',
                    si === 0 && pi === 0 && 'first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:text-5xl first-letter:leading-[0.85] first-letter:font-extrabold first-letter:text-primary',
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-14 rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold">{completed ? 'Module completed — nice work!' : 'Finished reading?'}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {completed ? 'Your progress is saved. Try the questionnaire to test what you learned.' : 'Mark this module as complete to update your progress.'}
              </p>
            </div>
            <Button
              variant={completed ? 'outline' : 'default'}
              className={cn('h-11 gap-2 px-5 text-sm', !completed && 'bg-green-600 text-white hover:bg-green-700')}
              onClick={markComplete}
              disabled={completed}
            >
              <CheckCircle2 className={cn('size-4.5', completed && 'text-green-600')} />
              {completed ? 'Completed' : 'Mark as complete'}
            </Button>
          </div>
          {nextModule && (
            <Link
              href={`/learning/${nextModule.id}`}
              className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted"
            >
              <span>
                <span className="block text-xs font-semibold text-muted-foreground">Up next</span>
                <span className="mt-0.5 block text-sm font-bold">{nextModule.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          )}
        </footer>
      </article>
    </div>
  )
}
