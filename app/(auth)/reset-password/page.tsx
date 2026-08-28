'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: '', confirmPassword: '' } })

  const onSubmit = () => setDone(true)

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100">
          <CircleCheck className="size-7 text-green-600" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Password updated</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your password has been changed successfully. Log in with your new password.</p>
        <Button size="lg" className="mt-7 h-11 w-full text-sm" onClick={() => router.push('/login')}>
          Go to login
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a strong password you haven&apos;t used before.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" aria-invalid={!!errors.password} {...register('password')} />
          {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input id="confirmPassword" type="password" placeholder="Repeat password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 h-11 w-full text-sm">
          {isSubmitting ? 'Saving…' : 'Reset password'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
