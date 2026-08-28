import * as React from 'react'
import { cn } from '@/lib/utils'

function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={cn('flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-bold text-primary', className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<'img'>) {
  return <img data-slot="avatar-image" className={cn('size-full object-cover', className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="avatar-fallback" className={cn('flex size-full items-center justify-center', className)} {...props} />
}

export { Avatar, AvatarImage, AvatarFallback }
