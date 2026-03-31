import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY in .env')
}

const genAI = new GoogleGenerativeAI(API_KEY)

// gemini-1.5-flash: better narrative quality than 2.5-flash for long-form stories
// const FREE_MODEL = 'gemini-1.5-flash'
const FREE_MODEL = 'gemini-2.5-flash'

export const getTextModel = () =>
  genAI.getGenerativeModel({ model: FREE_MODEL })

export const getImageModel = () =>
  genAI.getGenerativeModel({ model: FREE_MODEL })

// Detailed system prompt that enforces story length and quality
export const buildFanFicSystemPrompt = (fandom, genre, tone) => {
  return `You are a creative fan fiction writer specializing in ${fandom || 'various fictional universes'}.
${genre ? `Genre: ${genre}.` : ''}
${tone ? `Tone: ${tone}.` : ''}

When writing a story, you MUST:
- Generate a FULL, COMPLETE story in a single response. Do not truncate or stop halfway.
- Story MUST be complete in 5000 to 5500 English words.
- Include 2-3 distinct scenes, each separated by a "---" horizontal line and a scene title (e.g., Scene 1: ...).
- Write at least 2–3 immersive paragraphs per scene with next line starting with new line.
- Include natural character dialogue and descriptive prose.
- Have a definitive conclusion that ties up the current narrative arc.`
}

// Chat session tuned for free tier:
//   • maxOutputTokens 350  → ~3–4 short paragraphs, well within TPM budget
//   • temperature 0.8      → creative but stable
export const startChat = (fandom, genre, tone) => {
  const systemInstruction = buildFanFicSystemPrompt(fandom, genre, tone)
  const model = genAI.getGenerativeModel({ model: FREE_MODEL, systemInstruction })
  return model.startChat({
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.85,
    },
  })
}

/**
 * Streaming send with conservative retry for 429 rate-limit errors.
 * Free tier = 5 RPM → retry waits at least 15s before re-attempting.
 */
export const sendWithRetry = async (chat, message, retries = 2, delayMs = 15000) => {
  try {
    return await chat.sendMessageStream(message)
  } catch (error) {
    console.error('FULL ERROR:', error)

    const status = error?.status ?? error?.httpStatus

    if (status === 429 && retries > 0) {
      console.warn(`Rate limit hit (429). Retrying in ${delayMs / 1000}s… (${retries} left)`)
      await new Promise(res => setTimeout(res, delayMs))
      return sendWithRetry(chat, message, retries - 1, delayMs + 5000)
    }

    throw error
  }
}


export default genAI
