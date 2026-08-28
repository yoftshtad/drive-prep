'use client'

import { useEffect, useState } from 'react'
import type { Question } from './types'
import { questionBank as seedQuestions } from './mock-data'

export { type Question }

const KEY = 'dp.questions'
const EVENT = 'dp.questions-change'

export function getQuestions(): Question[] {
  if (typeof window === 'undefined') return seedQuestions
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Question[]) : seedQuestions
  } catch {
    return seedQuestions
  }
}

function save(list: Question[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function getQuestionsFor(moduleId: string): Question[] {
  return getQuestions().filter((q) => q.moduleId === moduleId)
}

export function getQuestion(id: string): Question | undefined {
  return getQuestions().find((q) => q.id === id)
}

export function createQuestion(input: Omit<Question, 'id'>): Question {
  const q: Question = { ...input, id: `q-${Date.now().toString(36)}` }
  save([...getQuestions(), q])
  return q
}

export function updateQuestion(id: string, patch: Partial<Question>) {
  save(getQuestions().map((q) => (q.id === id ? { ...q, ...patch } : q)))
}

export function deleteQuestion(id: string) {
  save(getQuestions().filter((q) => q.id !== id))
}

export function deleteQuestionsForModule(moduleId: string) {
  save(getQuestions().filter((q) => q.moduleId !== moduleId))
}

export function subscribeQuestions(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useQuestions(): Question[] {
  const [items, setItems] = useState<Question[]>(seedQuestions)
  useEffect(() => {
    const sync = () => setItems(getQuestions())
    sync()
    return subscribeQuestions(sync)
  }, [])
  return items
}
