'use client'

import type { Question } from './types'

export interface QuizSession {
  key: string
  title: string
  mode: 'practice' | 'mock'
  passMark: number
  timeLimitMin: number
  resultsPath: string
  introPath: string
  questions: Question[]
}

const KEY = 'dp.quiz-session'

export function setQuizSession(session: QuizSession) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(KEY, JSON.stringify(session))
}

export function getQuizSession(): QuizSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as QuizSession) : null
  } catch {
    return null
  }
}

export function clearQuizSession() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(KEY)
}
