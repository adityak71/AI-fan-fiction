import { useState, useRef, useEffect } from 'react'
import ChatBubble from '../components/ChatBubble'
import FandomSelector from '../components/FandomSelector'
import LoadingDots from '../components/LoadingDots'
import { useGeminiChat } from '../hooks/useGeminiChat'
import './TextChatPage.css'

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const TextChatPage = () => {
  const [input, setInput] = useState('')
  const [fandom, setFandom] = useState('Harry Potter')
  const [genre, setGenre] = useState('')
  const [tone, setTone] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const { messages, isLoading, cooldownSecs, error, sendMessage, initializeChat, clearChat } = useGeminiChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartChat = () => {
    initializeChat(fandom, genre, tone)
    setChatStarted(true)
    setSettingsOpen(false)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    if (!chatStarted) {
      initializeChat(fandom, genre, tone)
      setChatStarted(true)
    }
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    clearChat()
    setChatStarted(false)
    setSettingsOpen(false)
  }

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className="chat-sidebar glass-card">
        <div className="sidebar-header">
          <h2 className="sidebar-title gradient-text">Story Settings</h2>
          {chatStarted && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleClear}
              title="New story"
            >
              🔄 New
            </button>
          )}
        </div>

        <FandomSelector
          selected={fandom}
          onSelect={setFandom}
          genre={genre}
          onGenre={setGenre}
          tone={tone}
          onTone={setTone}
        />

        {!chatStarted && (
          <button className="btn btn-primary start-btn" onClick={handleStartChat}>
            🚀 Start Story Session
          </button>
        )}

        {chatStarted && (
          <div className="session-info">
            <div className="session-badge">
              <span className="session-dot" />
              Session Active
            </div>
            <p className="session-detail">
              <strong>{fandom}</strong>{genre ? ` · ${genre}` : ''}{tone ? ` · ${tone}` : ''}
            </p>
          </div>
        )}
      </aside>

      {/* Chat Area */}
      <main className="chat-main">
        <div className="chat-header">
          <div>
            <h1 className="chat-title">💬 Text Story Chat</h1>
            <p className="chat-subtitle">Streaming AI fan fiction in real time</p>
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="empty-emoji animate-float">📖</div>
              <h3>Ready to Write?</h3>
              <p>Select your fandom settings and start chatting to generate your fan fiction story!</p>
              <div className="empty-prompts">
                {[
                  'Write a scene where Harry meets a time traveler',
                  'Tony Stark discovers magic',
                  'Naruto and Goku have a ramen eating contest',
                ].map(prompt => (
                  <button
                    key={prompt}
                    className="prompt-chip"
                    onClick={() => {
                      setInput(prompt)
                      if (!chatStarted) {
                        initializeChat(fandom, genre, tone)
                        setChatStarted(true)
                      }
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(message => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {isLoading && messages.length > 0 && messages[messages.length - 1].role !== 'assistant' && (
            <LoadingDots label="Weaving your story..." />
          )}

          {error && (
            <div className="chat-error">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="input chat-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your story idea... (Enter to send, Shift+Enter for newline)"
            rows={2}
          />
          <button
            className="btn btn-primary send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label={cooldownSecs > 0 ? `Cooling down, ${cooldownSecs}s remaining` : 'Send message'}
            title={cooldownSecs > 0 ? `Free-tier cooldown: ${cooldownSecs}s` : ''}
          >
            {cooldownSecs > 0 ? `⏳ ${cooldownSecs}s` : isLoading ? <div className="spinner" /> : <SendIcon />}
          </button>
        </div>
      </main>
    </div>
  )
}

export default TextChatPage
