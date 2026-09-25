'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = ['Account', 'Payment', 'Upload', 'Access']

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  done && 'bg-green-600 text-white',
                  active && 'bg-primary text-primary-foreground',
                  !done && !active && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn('hidden text-xs font-semibold sm:block', active ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
              {i < steps.length - 1 && <span className={cn('h-0.5 flex-1 rounded-full', done ? 'bg-green-600' : 'bg-border')} />}
            </div>
          </li>
        )
      })}
    </ol>
  )
}