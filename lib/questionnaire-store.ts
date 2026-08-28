'use client'

import { useEffect, useState } from 'react'
import type { Questionnaire } from './types'
import { mockTests, questionnaires as seedQuestionnaires } from './mock-data'

export { type Questionnaire }

const KEY = 'dp.questionnaires'
const EVENT = 'dp.questionnaires-change'

function seed(): Questionnaire[] {
  return [...seedQuestionnaires, ...mockTests]
}

export function getQuestionnaires(): Questionnaire[] {
  if (typeof window === 'undefined') return seed()
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Questionnaire[]) : seed()
  } catch {
    return seed()
  }
}

function save(list: Questionnaire[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function getQuestionnaire(id: string): Questionnaire | undefined {
  return getQuestionnaires().find((q) => q.id === id)
}

export function createQuestionnaire(input: Omit<Questionnaire, 'id'>): Questionnaire {
  const q: Questionnaire = { ...input, id: `qnr-${Date.now().toString(36)}` }
  save([...getQuestionnaires(), q])
  return q
}

export function deleteQuestionnaire(id: string) {
  save(getQuestionnaires().filter((q) => q.id !== id))
}

export function deleteQuestionnairesForModule(moduleId: string) {
  save(getQuestionnaires().filter((q) => q.moduleId !== moduleId))
}

export function subscribeQuestionnaires(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useQuestionnaires(): Questionnaire[] {
  const [items, setItems] = useState<Questionnaire[]>(seed)
  useEffect(() => {
    const sync = () => setItems(getQuestionnaires())
    sync()
    return subscribeQuestionnaires(sync)
  }, [])
  return items
}
