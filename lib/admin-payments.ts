'use client'

import type { PaymentRecord } from './types'
import { paymentHistory } from './mock-data'

const KEY = 'dp.admin-payments'
const EVENT = 'dp.admin-payments-change'

export function getPayments(): PaymentRecord[] {
  if (typeof window === 'undefined') return paymentHistory
  try {
    const raw = window.localStorage.getItem(KEY)
    const overrides = raw ? (JSON.parse(raw) as Record<string, { status: PaymentRecord['status']; reason?: string }>) : {}
    return paymentHistory.map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p))
  } catch {
    return paymentHistory
  }
}

export function updatePayment(id: string, status: PaymentRecord['status'], reason?: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(KEY)
    const overrides = raw ? (JSON.parse(raw) as Record<string, { status: PaymentRecord['status']; reason?: string }>) : {}
    overrides[id] = { status, reason }
    window.localStorage.setItem(KEY, JSON.stringify(overrides))
    window.dispatchEvent(new Event(EVENT))
  } catch {
    // storage unavailable
  }
}

export function subscribePayments(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}
