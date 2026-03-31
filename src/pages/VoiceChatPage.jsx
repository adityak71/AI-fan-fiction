import { useState, useCallback } from 'react'
import ChatBubble from '../components/ChatBubble'
import FandomSelector from '../components/FandomSelector'
import LoadingDots from '../components/LoadingDots'
import { useGeminiChat } from '../hooks/useGeminiChat'
import { useVoiceInput } from '../hooks/useVoiceInput'
import './VoiceChatPage.css'

const VoiceChatPage = () => {
  const [fandom, setFandom] = useState('Harry Potter')
  const [genre, setGenre] = useState('')
  const [tone, setTone] = useState('')
  const [chatStarted, setChatStarted] = useState(false)

  const { messages, isLoading, error, sendMessage, initializeChat, clearChat } = useGeminiChat()

  const handleTranscript = useCallback(async (text) => {
    if (!chatStarted) {
      initializeChat(fandom, genre, tone)
      setChatStarted(true)
    }
    await sendMessage(text)
  }, [chatStarted, fandom, genre, tone, initializeChat, sendMessage])

  const { isListening, transcript, error: voiceError, startListening, stopListening } = useVoiceInput(handleTranscript)

  const handleClear = () => {
    clearChat()
    setChatStarted(false)
  }

  return (
    <div className="voice-page">
      {/* Left Panel */}
      <aside className="voice-sidebar glass-card">
        <div className="sidebar-header">
          <h2 className="sidebar-title gradient-text">Story Settings</h2>
          {chatStarted && (
            <button className="btn btn-ghost btn-sm" onClick={handleClear}>
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
        {chatStarted && (
          <div className="session-info" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600', color: '#10b981', marginBottom: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'block', animation: 'pulse 2s infinite' }} />
              Session Active
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>{fandom}</strong>{genre ? ` · ${genre}` : ''}{tone ? ` · ${tone}` : ''}
            </p>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="voice-main">
        <div className="chat-header">
          <div>
            <h1 className="chat-title">🎙️ Voice Story Chat</h1>
            <p className="chat-subtitle">Speak your story idea — let AI bring it to life</p>
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="voice-visual animate-float">
                <div className="voice-ring voice-ring--1" />
                <div className="voice-ring voice-ring--2" />
                <div className="voice-ring voice-ring--3" />
                <span className="voice-emoji">🎙️</span>
              </div>
              <h3>Press the Mic to Begin</h3>
              <p>Speak your fan fiction idea and the AI will turn it into a story!<br/>Works best in Chrome or Edge.</p>
            </div>
          )}

          {messages.map(message => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {isLoading && <LoadingDots label="Crafting your story..." />}
          {(error || voiceError) && (
            <div className="chat-error" style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.9rem' }}>
              ⚠️ {error || voiceError}
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="voice-controls">
          {isListening && (
            <div className="voice-transcript glass-card">
              <span className="transcript-dot" />
              <span>{transcript || 'Listening...'}</span>
            </div>
          )}

          <div className="mic-area">
            <button
              className={`mic-btn ${isListening ? 'mic-btn--active' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? (
                <span className="mic-icon">⏹️</span>
              ) : (
                <span className="mic-icon">🎙️</span>
              )}
            </button>

            <div className="mic-label">
              {isListening ? (
                <span style={{ color: '#ef4444', fontWeight: 600 }}>🔴 Recording... Click to stop</span>
              ) : isLoading ? (
                <span style={{ color: 'var(--text-muted)' }}>⏳ AI is writing...</span>
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>Click to start voice input</span>
              )}
            </div>
          </div>

          {!chatStarted && !isListening && (
            <p className="voice-tip">
              💡 Tip: Select your fandom settings first, then tap the mic!
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default VoiceChatPage
