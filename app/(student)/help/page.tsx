'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs: [string, string][] = [
  ['How long does payment verification take?', 'Most payments are verified within a few hours. You will receive an email as soon as your access is approved or if we need you to resubmit the receipt.'],
  ['I was rejected — what should I do?', 'Check the rejection reason on the payment page, make sure the amount and reference number are correct, then upload a new screenshot. You can resubmit as many times as needed.'],
  ['Can I retake mock tests?', 'Yes. Mock tests can be retaken unlimited times. Questions and options are re-randomized on every attempt.'],
  ['How is my score calculated?', 'Each question is worth one point. Your percentage is correct answers divided by total questions, and you pass with 70% or higher.'],
  ['Are questionnaires locked behind modules?', 'No. Questionnaires are independently accessible — you can practice any module at any time, in any order.'],
]

export default function HelpPage() {
  const [open, setOpen] = useState(0)

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Help & Support</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">Answers to common questions and ways to reach us.</p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a href="mailto:support@driveprep.example" className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)] transition-colors hover:bg-muted/40">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="size-5 text-primary" />
          </span>
          <span>
            <span className="block text-sm font-bold">Email support</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">support@driveprep.example · replies within 24h</span>
          </span>
        </a>
        <Link href="/payment" className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgb(16_24_40/0.05)] transition-colors hover:bg-muted/40">
          <span className="flex size-11 items-center justify-center rounded-xl bg-green-50">
            <MessageCircle className="size-5 text-green-600" />
          </span>
          <span>
            <span className="block text-sm font-bold">Payment issues</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">Review instructions or resubmit your receipt</span>
          </span>
        </Link>
      </div>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card shadow-[0_1px_3px_rgb(16_24_40/0.05)]">
        <div className="border-b border-border/70 p-5">
          <h2 className="text-base font-extrabold">Frequently asked questions</h2>
        </div>
        <div className="divide-y divide-border/70">
          {faqs.map(([question, answer], i) => (
            <div key={question}>
              <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {question}
                <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm leading-6 text-muted-foreground">{answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
