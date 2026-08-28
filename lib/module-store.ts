'use client'

import { useEffect, useState } from 'react'
import type { LearningModule, ModuleColor, ModuleContent } from './types'
import { modules as seedModules } from './mock-data'

const KEY = 'dp.modules'
const EVENT = 'dp.modules-change'

function seed(): LearningModule[] {
  return seedModules
}

export function getModules(): LearningModule[] {
  if (typeof window === 'undefined') return seed()
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LearningModule[]) : seed()
  } catch {
    return seed()
  }
}

function save(list: LearningModule[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function getModule(id: string): LearningModule | undefined {
  return getModules().find((m) => m.id === id)
}

export function createModule(input: { title: string; description: string; color: ModuleColor; order: number }): LearningModule {
  const mod: LearningModule = { ...input, id: `mod-${Date.now().toString(36)}`, progress: 0, questionCount: 0, lessons: [] }
  save([...getModules(), mod])
  return mod
}

export function updateModule(id: string, patch: Partial<LearningModule>) {
  save(getModules().map((m) => (m.id === id ? { ...m, ...patch } : m)))
}

export function deleteModule(id: string) {
  save(getModules().filter((m) => m.id !== id))
}

export function replaceModules(list: LearningModule[]) {
  save(list)
}

export function subscribeModules(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export { type LearningModule, type ModuleContent }
export function useModules(): { modules: LearningModule[]; ready: boolean } {
  const [modules, setModules] = useState<LearningModule[]>(seed)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const sync = () => setModules(getModules())
    sync()
    setReady(true)
    return subscribeModules(sync)
  }, [])
  return { modules, ready }
}
