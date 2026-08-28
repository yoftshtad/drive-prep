import type { ContentSection, ModuleContent } from './types'

interface Line {
  text: string
  size: number
  y: number
  page: number
}

function mode(numbers: number[]): number {
  const counts = new Map<number, number>()
  for (const n of numbers) counts.set(n, (counts.get(n) ?? 0) + 1)
  let best = 12
  let bestCount = 0
  for (const [value, count] of counts) {
    if (count > bestCount || (count === bestCount && value > best)) {
      best = value
      bestCount = count
    }
  }
  return best
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function looksLikeHeading(line: Line, bodySize: number): boolean {
  const text = line.text.trim()
  if (text.length === 0 || text.length > 90) return false
  if (/[.!?:;,]$/.test(text) && !/^\d+(\.\d+)*\s/.test(text)) return false
  if (line.size >= bodySize * 1.15) return true
  const letters = text.replace(/[^a-zA-Z]/g, '')
  if (letters.length >= 4 && letters === letters.toUpperCase() && text.length < 70) return true
  if (/^\d+(\.\d+)*\.?\s+\S/.test(text) && text.length < 70 && line.size >= bodySize * 1.05) return true
  return false
}

export async function extractPdfContent(file: File, onProgress?: (percent: number) => void): Promise<ModuleContent> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  const data = new Uint8Array(await file.arrayBuffer())
  const doc = await pdfjs.getDocument({ data }).promise

  const lines: Line[] = []
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum)
    const textContent = await page.getTextContent()
    let current: { text: string; size: number; y: number } | null = null
    for (const item of textContent.items) {
      if (!('str' in item)) continue
      const size = Math.round((item.transform[3] || item.transform[0]) * 10) / 10
      const y = Math.round(item.transform[5])
      if (item.str === '' && !item.hasEOL) continue
      if (!current) current = { text: item.str, size, y }
      else if (Math.abs(y - current.y) <= 2) {
        current.text += item.str
        current.size = Math.max(current.size, size)
      } else {
        lines.push({ text: current.text, size: current.size, y: current.y, page: pageNum })
        current = { text: item.str, size, y }
      }
      if (item.hasEOL) {
        lines.push({ text: current.text, size: current.size, y: current.y, page: pageNum })
        current = null
      }
    }
    if (current) lines.push({ text: current.text, size: current.size, y: current.y, page: pageNum })
    onProgress?.(Math.round((pageNum / doc.numPages) * 90))
  }

  const cleaned = lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, ' ').trim() }))
    .filter((l) => l.text.length > 0)
  if (cleaned.length < 5) {
    throw new Error('No extractable text found. This PDF may be scanned images — use a text-based PDF.')
  }

  const bodySize = mode(cleaned.map((l) => l.size))
  const gaps: number[] = []
  for (let i = 1; i < cleaned.length; i++) {
    if (cleaned[i].page === cleaned[i - 1].page) gaps.push(Math.abs(cleaned[i - 1].y - cleaned[i].y))
  }
  const normalGap = Math.max(median(gaps), bodySize * 1.15)

  const sections: ContentSection[] = []
  let currentHeading = 'Overview'
  let paragraphBuffer: string[] = []
  let currentParagraph = ''

  const flushParagraph = () => {
    const text = currentParagraph.trim()
    if (text) paragraphBuffer.push(text)
    currentParagraph = ''
  }

  const flushSection = () => {
    flushParagraph()
    if (paragraphBuffer.length > 0) {
      const existing = sections.find((s) => s.heading === currentHeading)
      if (existing) existing.paragraphs.push(...paragraphBuffer)
      else sections.push({ heading: currentHeading, paragraphs: [...paragraphBuffer] })
    }
    paragraphBuffer = []
  }

  for (let i = 0; i < cleaned.length; i++) {
    const line = cleaned[i]
    const prev = cleaned[i - 1]
    const gap = prev && prev.page === line.page ? Math.abs(prev.y - line.y) : normalGap
    const paragraphBreak = gap > normalGap * 1.45

    if (looksLikeHeading(line, bodySize)) {
      flushSection()
      currentHeading = line.text.replace(/\s+/g, ' ').trim()
      continue
    }

    if (paragraphBreak && currentParagraph) flushParagraph()

    if (currentParagraph.endsWith('-')) currentParagraph = currentParagraph.slice(0, -1) + line.text
    else currentParagraph += (currentParagraph ? ' ' : '') + line.text

    if (currentParagraph.length > 2400) flushParagraph()
  }
  flushSection()

  let finalSections = sections.filter((s) => s.paragraphs.length > 0)
  if (finalSections.length === 0) {
    const allParagraphs = sections.flatMap((s) => s.paragraphs)
    finalSections = []
    for (let i = 0; i < allParagraphs.length; i += 3) {
      finalSections.push({ heading: `Part ${finalSections.length + 1}`, paragraphs: allParagraphs.slice(i, i + 3) })
    }
  }

  onProgress?.(100)
  const words = finalSections.reduce((acc, s) => acc + s.paragraphs.join(' ').split(/\s+/).length, 0)
  return { fileName: file.name, pages: doc.numPages, words, sections: finalSections }
}

export function estimateReadingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200))
}
