'use client'

import { useEffect, useState } from 'react'
import type { AttemptRecord } from './types'

const KEY = 'dp.attempts'

export function getAttempts(): AttemptRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AttemptRecord[]) : []
  } catch {
    return []
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

export function useAttempts(): AttemptRecord[] {
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])
  useEffect(() => {
    const sync = () => setAttempts(getAttempts())
    sync()
    return subscribeAttempts(sync)
  }, [])
  return attempts
}

export function subscribeAttempts(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

const EVENT = 'dp.attempts-change'