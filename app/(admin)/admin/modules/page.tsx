'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { ModuleIcon } from '@/components/student/module-icon'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Progress } from '@/components/ui/progress'
import { moduleMeta } from '@/lib/mock-data'
import { deleteModule, useModules, type LearningModule } from '@/lib/module-store'
import { deleteQuestionnairesForModule } from '@/lib/questionnaire-store'
import { deleteQuestionsForModule } from '@/lib/question-store'
import { deleteModuleProgress } from '@/lib/progress-store'

export default function AdminModulesPage() {
  const { modules } = useModules()
  const [pendingDelete, setPendingDelete] = useState<LearningModule | null>(null)
  const [deletedTitle, setDeletedTitle] = useState<string | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteModule(pendingDelete.id)
    deleteQuestionnairesForModule(pendingDelete.id)
    deleteQuestionsForModule(pendingDelete.id)
    deleteModuleProgress(pendingDelete.id)
    setDeletedTitle(pendingDelete.title)
    setPendingDelete(null)
    setTimeout(() => setDeletedTitle(null), 4000)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Modules</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            {modules.length} modules. Upload a PDF per module — students read it in-app like a blog post.
          </p>
        </div>
        <Link href="/admin/modules/new" className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="size-4" /> New module
        </Link>
      </header>

      {deletedTitle && (
        <p className="mt-4 rounded-lg bg-green-50 px-3.5 py-2.5 text-sm font-medium text-green-700 ring-1 ring-green-100">
          Module “{deletedTitle}” and its content, questionnaires and questions were deleted.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {modules.map((mod) => {
          const meta = moduleMeta[mod.color]
          return (
            <article key={mod.id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
              <Link href={`/admin/modules/${mod.id}/edit`} className="flex min-w-0 flex-1 flex-wrap items-center gap-5">
                <ModuleIcon moduleId={mod.id} color={mod.color} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Module {mod.order} · {mod.content ? `${mod.content.sections.length} sections` : mod.lessons.length > 0 ? `${mod.lessons.length} lessons` : 'No content'}
                  </p>
                  <h2 className="text-base font-bold">{mod.title}</h2>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{mod.description}</p>
                </div>
                {mod.content ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    <FileText className="size-3.5" /> PDF · {mod.content.pages}p
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">No PDF yet</span>
                )}
                <div className="w-40">
                  <Progress value={mod.progress} indicatorClassName={meta.bar} />
                  <p className={`mt-1.5 text-xs font-bold ${meta.text}`}>{mod.progress}% avg completion</p>
                </div>
              </Link>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/modules/${mod.id}/edit`}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setPendingDelete(mod)}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                  aria-label={`Delete module ${mod.title}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
          )
        })}
        {modules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <h2 className="text-base font-bold">No modules</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
              Create your first module, then upload its PDF so students can start reading.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete “${pendingDelete?.title ?? ''}”?`}
        message="This permanently removes the module along with its PDF content, questionnaires, questions and student progress for it. This cannot be undone."
        confirmLabel="Delete module"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
