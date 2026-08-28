'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircleAlert, ImagePlus, Trash2, Upload } from 'lucide-react'
import { OnboardingGuard } from '@/components/app/onboarding-guard'
import { Stepper } from '@/components/app/stepper'
import { setAccessState } from '@/lib/access'
import { Button } from '@/components/ui/button'

const MAX_SIZE_MB = 5
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

export default function PaymentUploadPage() {
  return (
    <OnboardingGuard>
      <UploadForm />
    </OnboardingGuard>
  )
}

function UploadForm() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const pick = (selected: File | undefined) => {
    setError(null)
    if (!selected) return
    if (!ACCEPTED.includes(selected.type)) {
      setError('Invalid file type. Please upload a PNG, JPG or WEBP screenshot.')
      return
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a screenshot of your payment receipt first.')
      return
    }
    setSubmitting(true)
    // MVP: R2 upload + payment record creation happens server-side in production.
    setTimeout(() => {
      setAccessState('pending')
      router.push('/payment/pending')
    }, 600)
  }

  return (
    <div>
      <Stepper current={2} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Upload payment screenshot</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Attach a clear screenshot showing the amount, reference number and date. Files up to {MAX_SIZE_MB}MB (PNG, JPG, WEBP).
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
          aria-label="Payment screenshot"
        />

        {preview ? (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
              <p className="max-w-64 truncate text-sm font-semibold">{file?.name}</p>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Payment receipt preview" className="max-h-96 w-full object-contain" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-14 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <ImagePlus className="size-6 text-primary" />
            </span>
            <span className="text-sm font-semibold text-foreground">Click to select your screenshot</span>
            <span className="text-xs text-muted-foreground">or drag and drop it here</span>
          </button>
        )}

        {error && (
          <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4 shrink-0" /> {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full text-sm">
          {submitting ? (
            'Submitting…'
          ) : (
            <>
              <Upload className="size-4" /> Submit for verification
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">Verification is done manually by our team and usually takes a few hours.</p>
      </form>
    </div>
  )
}
