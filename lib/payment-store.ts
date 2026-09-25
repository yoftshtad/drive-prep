'use client'

import { useEffect, useState } from 'react'
import type { PaymentRecord } from './types'

const KEY = 'dp.payments'
const EVENT = 'dp.payments-change'

export function getPayments(): PaymentRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PaymentRecord[]) : []
  } catch {
    return []
  }
}

export function createPayment(payment: Omit<PaymentRecord, 'id'> & { id?: string }): PaymentRecord {
  if (typeof window === 'undefined') return null as any
  const newPayment: PaymentRecord = {
    ...payment,
    id: payment.id ?? `pay-${Date.now().toString(36)}`,
  }
  const payments = getPayments()
  window.localStorage.setItem(KEY, JSON.stringify([newPayment, ...payments]))
  window.dispatchEvent(new Event(EVENT))
  return newPayment
}

export function updatePayment(id: string, status: PaymentRecord['status'], reason?: string) {
  if (typeof window === 'undefined') return
  const payments = getPayments().map((p) => (p.id === id ? { ...p, status, reason } : p))
  window.localStorage.setItem(KEY, JSON.stringify(payments))
  window.dispatchEvent(new Event(EVENT))
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

export function usePayments(): PaymentRecord[] {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  useEffect(() => {
    const sync = () => setPayments(getPayments())
    sync()
    return subscribePayments(sync)
  }, [])
  return payments
}