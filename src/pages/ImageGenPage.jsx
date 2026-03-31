import { useState } from 'react'
import { getTextModel } from '../utils/gemini'
import './ImageGenPage.css'

const samplePrompts = [
  'Harry Potter and Hermione in a futuristic Hogwarts',
  'Iron Man fighting a dragon in Middle Earth',
  'Naruto meets Luffy in a sunset battle scene',
  'Game of Thrones characters in a cyberpunk city',
  'Star Wars characters at a magical school',
]

const stylePresets = ['Cinematic', 'Anime', 'Watercolor', 'Oil Painting', 'Digital Art', 'Comic Book']

const ImageGenPage = () => {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Cinematic')
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageDescription, setImageDescription] = useState('')
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setImageUrl(null)
    setImageDescription('')

    const fullPrompt = `Create a vivid, detailed ${style.toLowerCase()} style fan fiction scene: ${prompt}. 
    Describe the scene in extraordinary detail as if painting it with words, covering: 
    the characters' appearances and expressions, the environment and atmosphere, lighting and colors, 
    and the emotional tone of the moment. Make it immersive and visually stunning.`

    try {
      const model = getTextModel()
      const result = await model.generateContent(fullPrompt)
      const text = result.response.text()
      setImageDescription(text)

      // Generate a Picsum image with seed from prompt for visual demo
      const seed = encodeURIComponent(prompt.slice(0, 30))
      const colors = ['7c3aed', 'ec4899', '3b82f6', '06b6d4', 'f59e0b']
      const color = colors[Math.floor(Math.random() * colors.length)]
      setImageUrl(`https://picsum.photos/seed/${Date.now()}/800/500`)

      setHistory(prev => [{ prompt, style, description: text, url: `https://picsum.photos/seed/${Date.now() - 1}/300/200` }, ...prev.slice(0, 5)])
    } catch (err) {
      console.error('Image gen error:', err)
      setError('Failed to generate scene. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  return (
    <div className="image-page">
      <main className="image-main">
        <div className="image-header">
          <h1 className="chat-title">🎨 Image Generation</h1>
          <p className="chat-subtitle">Describe your fan fiction scene — AI will paint it with words and visuals</p>
        </div>

        {/* Prompt Area */}
        <div className="image-prompt-area glass-card">
          <div className="style-row">
            <label className="fandom-label">Art Style</label>
            <div className="fandom-chips">
              {stylePresets.map(s => (
                <button
                  key={s}
                  className={`fandom-chip ${style === s ? 'fandom-chip--active' : ''}`}
                  style={{ '--chip-color': 'var(--accent-purple)' }}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-input-row">
            <textarea
              className="input prompt-textarea"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your fan fiction scene... e.g. 'Harry Potter meets Thor at Hogwarts during a thunderstorm'"
              rows={3}
            />
            <button
              className="btn btn-primary generate-btn"
              onClick={generateImage}
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? <><div className="spinner" /> Generating...</> : <><span>✨</span> Generate Scene</>}
            </button>
          </div>

          <div className="sample-prompts">
            <span className="fandom-label">Try these:</span>
            <div className="fandom-chips">
              {samplePrompts.map(p => (
                <button key={p} className="fandom-chip" onClick={() => setPrompt(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="gen-loading glass-card">
            <div className="gen-loading-visual">
              <div className="loading-ring" />
              <span>🎨</span>
            </div>
            <h3>Painting your scene...</h3>
            <p>The AI is crafting a vivid description of your fan fiction moment</p>
          </div>
        )}

        {/* Result */}
        {imageUrl && imageDescription && !isLoading && (
          <div className="gen-result glass-card animate-fade-in">
            <img src={imageUrl} alt="Generated scene" className="gen-image" />
            <div className="gen-description-area">
              <div className="gen-description-header">
                <h3>🖼️ Scene Description <span className="badge">{style}</span></h3>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigator.clipboard.writeText(imageDescription)}
                >
                  📋 Copy
                </button>
              </div>
              <div className="gen-description-text">
                {imageDescription}
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="gen-history">
            <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recent Generations</h3>
            <div className="history-grid">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="history-card glass-card"
                  onClick={() => {
                    setPrompt(item.prompt)
                    setStyle(item.style)
                    setImageDescription(item.description)
                    setImageUrl(item.url)
                  }}
                >
                  <img src={item.url} alt="Past generation" className="history-thumb" />
                  <div className="history-info">
                    <p className="history-prompt">{item.prompt}</p>
                    <span className="badge">{item.style}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ImageGenPage
