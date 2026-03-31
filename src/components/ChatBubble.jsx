import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './ChatBubble.css'

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
)

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user'
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Stop speaking if the component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Cancel any existing speech before starting new one
    window.speechSynthesis.cancel()

    // Clean text: remove markdown symbols so it sounds natural
    const cleanText = message.content
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
      .replace(/(\*|_)(.*?)\1/g, '$2')    // italic
      .replace(/#+\s/g, '')               // headers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
      .replace(/`{1,3}.*?`{1,3}/gs, '')   // code blocks
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    // Optional: Pick a nice voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices[0]
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--assistant'}`}>
      <div className={`chat-avatar ${isUser ? 'chat-avatar--user' : 'chat-avatar--bot'}`}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div className="chat-content">
        <div className="chat-role">{isUser ? 'You' : 'AI Story Teller'}</div>
        <div className={`chat-text ${isUser ? 'chat-text--user' : 'chat-text--bot'}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
          )}
          
          {!isUser && message.content && (
            <button 
              className={`speak-btn ${isSpeaking ? 'speak-btn--active' : ''}`} 
              onClick={toggleSpeech}
              title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            >
              {isSpeaking ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="6" y="6" width="12" height="12"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
