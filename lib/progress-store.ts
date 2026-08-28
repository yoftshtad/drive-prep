'use client'

import { useEffect, useState } from 'react'

export interface ReadingProgress {
  percent: number
  completed: boolean
  lastReadAt: string
}

const KEY = 'dp.progress'
const EVENT = 'dp.progress-change'

const seedProgress: Record<string, ReadingProgress> = {
  'traffic-signs': { percent: 0, completed: false, lastReadAt: '' },
  'road-rules': { percent: 0, completed: false, lastReadAt: '' },
  'defensive-driving': { percent: 0, completed: false, lastReadAt: '' },
  'vehicle-knowledge': { percent: 0, completed: false, lastReadAt: '' },
}

export function getProgressMap(): Record<string, ReadingProgress> {
  if (typeof window === 'undefined') return seedProgress
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, ReadingProgress>) : seedProgress
  } catch {
    return seedProgress
  }
}

export function getModuleProgress(moduleId: string): ReadingProgress | undefined {
  return getProgressMap()[moduleId]
}

export function saveReadingProgress(moduleId: string, percent: number, completed = false) {
  if (typeof window === 'undefined') return
  const map = getProgressMap()
  const existing = map[moduleId]
  const nextPercent = Math.max(existing?.percent ?? 0, Math.round(percent))
  map[moduleId] = {
    percent: Math.min(100, nextPercent),
    completed: completed || (existing?.completed ?? false),
    lastReadAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }
  window.localStorage.setItem(KEY, JSON.stringify(map))
  window.dispatchEvent(new Event(EVENT))
}

export function deleteModuleProgress(moduleId: string) {
  if (typeof window === 'undefined') return
  const map = getProgressMap()
  delete map[moduleId]
  window.localStorage.setItem(KEY, JSON.stringify(map))
  window.dispatchEvent(new Event(EVENT))
}

export function subscribeProgress(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useProgressMap(): Record<string, ReadingProgress> {
  const [map, setMap] = useState<Record<string, ReadingProgress>>(seedProgress)
  useEffect(() => {
    const sync = () => setMap(getProgressMap())
    sync()
    return subscribeProgress(sync)
  }, [])
  return map
}
