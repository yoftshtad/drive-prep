'use client'

import type { AttemptRecord } from './types'
import { attemptHistory } from './mock-data'

const KEY = 'dp.attempts'

export function getAttempts(): AttemptRecord[] {
  if (typeof window === 'undefined') return attemptHistory
  try {
    const raw = window.localStorage.getItem(KEY)
    const saved = raw ? (JSON.parse(raw) as AttemptRecord[]) : []
    return [...saved, ...attemptHistory]
  } catch {
    return attemptHistory
  }
}

export function saveAttempt(record: AttemptRecord) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(KEY)
    const saved = raw ? (JSON.parse(raw) as AttemptRecord[]) : []
    window.localStorage.setItem(KEY, JSON.stringify([record, ...saved].slice(0, 30)))
  } catch {
    // storage unavailable
  }
}

export interface LastAttempt {
  title: string
  mode: 'practice' | 'mock'
  score: number
  total: number
  percent: number
  passed: boolean
  passMark: number
  timeSpentSec: number
  completedAt: string
  answers: { questionId: string; selected: number[]; correct: boolean }[]
}

const LAST_KEY = 'dp.lastAttempt'

export function setLastAttempt(attempt: LastAttempt) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(LAST_KEY, JSON.stringify(attempt))
}

export function getLastAttempt(): LastAttempt | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(LAST_KEY)
    return raw ? (JSON.parse(raw) as LastAttempt) : null
  } catch {
    return null
  }
}
