'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { ContentUploader } from '@/components/admin/content-uploader'
import { ModuleForm } from '@/components/admin/module-form'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { deleteModule, updateModule, useModules } from '@/lib/module-store'
import { deleteQuestionnairesForModule } from '@/lib/questionnaire-store'
import { deleteQuestionsForModule } from '@/lib/question-store'
import { deleteModuleProgress } from '@/lib/progress-store'

export default function EditModulePage() {
  const params = useParams<{ moduleId: string }>()
  const router = useRouter()
  const { modules } = useModules()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mod = modules.find((m) => m.id === params.moduleId)

  if (!mod) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="text-xl font-bold">Module not found</h1>
        <Link href="/admin/modules" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Back to modules
        </Link>
      </div>
    )
  }

  const confirmDeleteAction = () => {
    deleteModule(mod.id)
    deleteQuestionnairesForModule(mod.id)
    deleteQuestionsForModule(mod.id)
    deleteModuleProgress(mod.id)
    setConfirmDelete(false)
    router.push('/admin/modules')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/modules" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Modules
      </Link>
      <header className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Edit module</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Update details, manage the PDF content students read.</p>
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex h-10 items-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
        >
          <Trash2 className="size-4" /> Delete module
        </button>
      </header>

      <div className="flex flex-col gap-6">
        <ContentUploader module={mod} />

        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
          <h2 className="mb-5 text-base font-extrabold">Details</h2>
          <ModuleForm
            submitLabel="Save changes"
            initial={{ title: mod.title, description: mod.description, color: mod.color, order: mod.order }}
            onSubmit={(values) => updateModule(mod.id, values)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete “${mod.title}”?`}
        message="This permanently removes the module along with its PDF content, questionnaires, questions and student progress for it. This cannot be undone."
        confirmLabel="Delete module"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
