import { cn } from '@/lib/utils'

export function SteeringWheelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={cn('size-5', className)} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 14.6V21" />
      <path d="M9.6 10.9 3.4 9.2" />
      <path d="m14.4 10.9 6.2-1.7" />
    </svg>
  )
}

export function DrivePrepLogo({ href = '/', tagline = true, className }: { href?: string; tagline?: boolean; className?: string }) {
  return (
    <a href={href} className={cn('flex items-center gap-2.5', className)} aria-label="DrivePrep home">
      <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
        <SteeringWheelIcon className="size-5.5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-extrabold tracking-tight text-foreground">DrivePrep</span>
        {tagline && <span className="text-[10px] font-medium text-muted-foreground">Prepare. Practice. Pass.</span>}
      </span>
    </a>
  )
}
