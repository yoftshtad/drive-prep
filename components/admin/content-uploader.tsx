'use client'

import { useRef, useState } from 'react'
import { CircleAlert, CircleCheck, FileText, Loader2, Trash2, Upload } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import { updateModule } from '@/lib/module-store'
import { extractPdfContent, estimateReadingMinutes } from '@/lib/pdf-extract'
import type { LearningModule } from '@/lib/types'

const MAX_SIZE_MB = 20

export function ContentUploader({ module: mod, onSaved }: { module: LearningModule; onSaved?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [extracting, setExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [staged, setStaged] = useState<LearningModule['content'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const pick = async (file: File | undefined) => {
    setError(null)
    setSaved(false)
    setStaged(null)
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a .pdf file.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }
    setExtracting(true)
    setProgress(0)
    try {
      const content = await extractPdfContent(file, setProgress)
      setStaged(content)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this PDF. Try a different file.')
    } finally {
      setExtracting(false)
    }
  }

  const save = () => {
    if (!staged) return
    updateModule(mod.id, { content: staged })
    setSaved(true)
    setStaged(null)
    onSaved?.()
  }

  const remove = () => {
    updateModule(mod.id, { content: undefined })
    setConfirmRemove(false)
    setSaved(false)
    onSaved?.()
  }

  const content = staged ?? mod.content

  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
      <div className="flex items-center justify-between border-b border-border/70 p-5">
        <div>
          <h2 className="text-base font-extrabold">Module content</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Upload the module&apos;s PDF — students read it inside the platform like a blog post, with progress tracking.
          </p>
        </div>
      </div>

      <div className="p-5">
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => pick(e.target.files?.[0])} aria-label="Module PDF" />

        {extracting ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-10 text-center">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm font-semibold">Extracting text… {progress}%</p>
            <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : content ? (
          <div className="rounded-2xl border border-border/70">
            <div className="flex flex-wrap items-center gap-4 border-b border-border/70 px-5 py-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-green-50">
                <FileText className="size-5 text-green-600" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{content.fileName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {content.pages} pages · {content.sections.length} sections · {content.words.toLocaleString()} words · ~
                  {estimateReadingMinutes(content.words)} min read
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                  <CircleCheck className="size-4" /> {staged ? 'Ready to save' : 'Published'}
                </span>
                {!staged && (
                  <>
                    <button className="rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5" onClick={() => inputRef.current?.click()}>
                      Replace
                    </button>
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5"
                      onClick={() => setConfirmRemove(true)}
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto px-5 py-4">
              {content.sections.slice(0, 6).map((section, i) => (
                <div key={i} className="not-first:mt-4">
                  <p className="text-sm font-bold">{section.heading}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{section.paragraphs[0]}</p>
                </div>
              ))}
              {content.sections.length > 6 && <p className="mt-4 text-xs font-semibold text-muted-foreground">+ {content.sections.length - 6} more sections</p>}
            </div>
            {staged && (
              <div className="flex justify-end gap-2.5 border-t border-border/70 px-5 py-4">
                <Button className="h-10 px-5 text-sm" onClick={save}>
                  Save content to module
                </Button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Upload className="size-6 text-primary" />
            </span>
            <span className="text-sm font-semibold">Upload module PDF</span>
            <span className="max-w-sm text-xs leading-5 text-muted-foreground">
              The text is extracted automatically and shown to students as a blog-post-style article. Up to {MAX_SIZE_MB}MB.
            </span>
          </button>
        )}

        {saved && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3.5 py-2.5 text-sm font-medium text-green-700 ring-1 ring-green-100">
            <CircleCheck className="size-4" /> Content saved. Students now see this module as a reading article.
          </p>
        )}
        {error && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4 shrink-0" /> {error}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove module content?"
        message="Students will no longer see the reading article for this module. This cannot be undone."
        confirmLabel="Remove content"
        onConfirm={remove}
        onCancel={() => setConfirmRemove(false)}
      />
    </section>
  )
}
