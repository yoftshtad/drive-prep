'use client'

import { useEffect, useState } from 'react'
import type { AccessState } from './types'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  access: AccessState
  joined: string
  attempts: number
}

const KEY = 'dp.users'
const EVENT = 'dp.users-change'

const seedUsers: AdminUser[] = [
  { id: 'u-1001', name: 'John Doe', email: 'john@example.com', access: 'active', joined: 'Aug 10, 2026', attempts: 24 },
  { id: 'u-1002', name: 'Maria Santos', email: 'maria@example.com', access: 'pending', joined: 'Aug 14, 2026', attempts: 0 },
  { id: 'u-1003', name: 'Ahmed Karim', email: 'ahmed@example.com', access: 'pending', joined: 'Aug 15, 2026', attempts: 2 },
  { id: 'u-1004', name: 'Lisa Chen', email: 'lisa@example.com', access: 'rejected', joined: 'Aug 9, 2026', attempts: 11 },
  { id: 'u-1005', name: 'Diego Ramos', email: 'diego@example.com', access: 'active', joined: 'Aug 2, 2026', attempts: 41 },
  { id: 'u-1006', name: 'Fatima Nour', email: 'fatima@example.com', access: 'active', joined: 'Jul 28, 2026', attempts: 17 },
  { id: 'u-1007', name: 'Ivan Petrov', email: 'ivan@example.com', access: 'unpaid', joined: 'Aug 16, 2026', attempts: 0 },
  { id: 'u-1008', name: 'Grace Kim', email: 'grace@example.com', access: 'active', joined: 'Jul 15, 2026', attempts: 63 },
]

export function getUsers(): AdminUser[] {
  if (typeof window === 'undefined') return seedUsers
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AdminUser[]) : seedUsers
  } catch {
    return seedUsers
  }
}

export function createUser(input: { id: string; name: string; email: string; phone?: string }): AdminUser {
  if (typeof window === 'undefined') return null as any
  const user: AdminUser = {
    id: input.id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    access: 'unpaid',
    joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    attempts: 0,
  }
  const users = getUsers()
  window.localStorage.setItem(KEY, JSON.stringify([user, ...users]))
  window.dispatchEvent(new Event(EVENT))
  return user
}

export function updateUserAccess(id: string, access: AccessState) {
  if (typeof window === 'undefined') return
  const users = getUsers().map((u) => (u.id === id ? { ...u, access } : u))
  window.localStorage.setItem(KEY, JSON.stringify(users))
  window.dispatchEvent(new Event(EVENT))
}

export function deleteUser(id: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(getUsers().filter((u) => u.id !== id)))
  window.dispatchEvent(new Event(EVENT))
}

export function subscribeUsers(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useUsers(): AdminUser[] {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers)
  useEffect(() => {
    const sync = () => setUsers(getUsers())
    sync()
    return subscribeUsers(sync)
  }, [])
  return users
}
