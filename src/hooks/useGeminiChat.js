import { useState, useRef, useCallback } from 'react'
import { startChat, sendWithRetry } from '../utils/gemini'

// ---------------------------------------------------------------------------
// Free-tier throttle: 5 RPM → 60s ÷ 5 = 12 seconds minimum between requests.
// This physically prevents exceeding the rate limit regardless of user behaviour.
// ---------------------------------------------------------------------------
const MIN_REQUEST_GAP_MS = 12000
let lastRequestTime = 0

async function safeRequest(fn) {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_GAP_MS) {
    const wait = MIN_REQUEST_GAP_MS - elapsed
    console.info(`Throttling: waiting ${(wait / 1000).toFixed(1)}s to respect 5 RPM limit…`)
    await new Promise(res => setTimeout(res, wait))
  }
  lastRequestTime = Date.now()
  return fn()
}

// Maximum messages kept in state — keeps prompt size and memory small
const MAX_HISTORY = 6

export const useGeminiChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cooldownSecs, setCooldownSecs] = useState(0)
  const chatRef = useRef(null)
  const cooldownRef = useRef(null)

  const initializeChat = useCallback((fandom, genre, tone) => {
    chatRef.current = startChat(fandom, genre, tone)
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `✨ Ready to craft **${fandom || 'fan fiction'}** stories! ${genre ? `Genre: **${genre}**. ` : ''}${tone ? `Tone: **${tone}**. ` : ''}Tell me what adventure you'd like to explore!`,
      },
    ])
    setError(null)
  }, [])

  // Starts a visible countdown in the UI so users know how long to wait
  const startCooldown = useCallback((seconds) => {
    setCooldownSecs(seconds)
    clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setCooldownSecs(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current)
          setIsLoading(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || isLoading) return

    // crypto.randomUUID() guarantees unique keys — Date.now()+1 can collide
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: userMessage }
    const assistantMsgId = crypto.randomUUID()

    setMessages(prev => {
      const trimmed = prev.slice(-MAX_HISTORY)
      return [...trimmed, userMsg, { id: assistantMsgId, role: 'assistant', content: '' }]
    })
    setIsLoading(true)
    setError(null)

    try {
      if (!chatRef.current) {
        chatRef.current = startChat()
      }

      const result = await safeRequest(() =>
        sendWithRetry(chatRef.current, userMessage)
      )

      let fullText = ''
      let lastUpdate = 0

      for await (const chunk of result.stream) {
        fullText += chunk.text()

        // Throttle UI updates to every 50ms — prevents dropped frames on fast streams
        const now = Date.now()
        if (now - lastUpdate > 50) {
          lastUpdate = now
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
            )
          )
        }
      }

      // Final update — ensures the very last chunk is never missed
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId ? { ...msg, content: fullText } : msg
        )
      )

      const elapsed = Date.now() - lastRequestTime
      const remaining = Math.max(0, MIN_REQUEST_GAP_MS - elapsed)
      if (remaining > 0) {
        startCooldown(Math.ceil(remaining / 1000))
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Gemini chat error:', err)
      const status = err?.status ?? err?.httpStatus
      if (status === 429) {
        setError('⏳ Rate limit reached — the app will automatically retry after a cooldown.')
      } else if (status === 403) {
        setError('🔒 Access denied. Check that your API key is valid.')
      } else {
        setError('Failed to get response. Please try again.')
      }
      setMessages(prev => prev.filter(msg => msg.id !== assistantMsgId))
      setIsLoading(false)
    }
  }, [isLoading, startCooldown])

  const clearChat = useCallback(() => {
    setMessages([])
    chatRef.current = null
    setError(null)
    setIsLoading(false)
    setCooldownSecs(0)
    clearInterval(cooldownRef.current)
  }, [])

  return { messages, isLoading, cooldownSecs, error, sendMessage, initializeChat, clearChat }
}
