const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendScreenshotToTelegram(
  dataUrl: string,
  userName: string,
  userEmail: string,
  userPhone: string | undefined
): Promise<{ ok: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured')
    return { ok: false, error: 'Telegram not configured' }
  }

  try {
    const base64Data = dataUrl.split(',')[1]
    if (!base64Data) {
      return { ok: false, error: 'Invalid data URL' }
    }

    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('chat_id', TELEGRAM_CHAT_ID)
    formData.append('photo', blob, 'payment-screenshot.jpg')
    formData.append(
      'caption',
      `📸 New payment screenshot\n👤 ${userName}\n📧 ${userEmail || '—'}\n📱 ${userPhone || '—'}\n🕐 ${new Date().toLocaleString()}`,
    )

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    if (!result.ok) {
      return { ok: false, error: result.description || 'Telegram API error' }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export function isTelegramConfigured(): boolean {
  return !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)
}