import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: false, error: 'Telegram not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userName = formData.get('userName') as string || 'Student'
    const userEmail = formData.get('userEmail') as string || ''
    const userPhone = formData.get('userPhone') as string || ''

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tgFormData = new FormData()
    tgFormData.append('chat_id', TELEGRAM_CHAT_ID)
    tgFormData.append('photo', new Blob([buffer], { type: file.type }), 'payment-screenshot.jpg')
    tgFormData.append(
      'caption',
      `📸 New payment screenshot\n👤 ${userName}\n📧 ${userEmail || '—'}\n📱 ${userPhone || '—'}\n🕐 ${new Date().toLocaleString()}`,
    )

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: tgFormData,
    })

    const result = await response.json()

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.description || 'Telegram API error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Telegram upload error:', e)
    return NextResponse.json({ ok: false, error: 'Failed to send screenshot' }, { status: 500 })
  }
}