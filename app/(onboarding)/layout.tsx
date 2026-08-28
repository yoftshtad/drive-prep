import Link from 'next/link'
import { SteeringWheelIcon } from '@/components/app/logo'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="DrivePrep home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
              <SteeringWheelIcon className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-foreground">DrivePrep</span>
          </Link>
          <a href="/help" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Need help?
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-12">{children}</main>
    </div>
  )
}
