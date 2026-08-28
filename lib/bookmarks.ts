'use client'

import { useEffect, useState } from 'react'

const KEY = 'dp.bookmarks'
const EVENT = 'dp.bookmarks-change'

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function toggleBookmark(questionId: string) {
  if (typeof window === 'undefined') return
  const current = getBookmarks()
  const next = current.includes(questionId) ? current.filter((id) => id !== questionId) : [questionId, ...current]
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(EVENT))
}

export function useBookmarks(): string[] {
  const [ids, setIds] = useState<string[]>([])
  useEffect(() => {
    const sync = () => setIds(getBookmarks())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return ids
}
