'use client'

import { BookOpen, Car, CarFront, Gavel, ShieldCheck, TrafficCone } from 'lucide-react'
import type { ModuleColor } from '@/lib/types'
import { moduleMeta } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const iconsById: Record<string, typeof Car> = {
  'traffic-signs': TrafficCone,
  'road-rules': Gavel,
  'defensive-driving': ShieldCheck,
  'vehicle-knowledge': Car,
}

const iconsByColor: Record<ModuleColor, typeof Car> = {
  blue: CarFront,
  orange: Gavel,
  green: ShieldCheck,
  purple: BookOpen,
}

export function ModuleIcon({ moduleId, color, className }: { moduleId?: string; color: ModuleColor; className?: string }) {
  const Icon = (moduleId && iconsById[moduleId]) || iconsByColor[color] || BookOpen
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-xl', moduleMeta[color].soft, className ?? 'size-14')}>
      <Icon className={cn('size-7', moduleMeta[color].text)} />
    </span>
  )
}
