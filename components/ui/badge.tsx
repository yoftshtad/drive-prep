import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-muted text-muted-foreground',
        success: 'border-transparent bg-green-100 text-green-700',
        warning: 'border-transparent bg-amber-100 text-amber-700',
        destructive: 'border-transparent bg-red-100 text-red-700',
        info: 'border-transparent bg-blue-100 text-blue-700',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
