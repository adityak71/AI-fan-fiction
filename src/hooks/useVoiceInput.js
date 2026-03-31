import { useState, useRef, useCallback } from 'react'

export const useVoiceInput = (onTranscript) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Try Chrome or Edge.')
      return
    }

    setError(null)
    setTranscript('')
    finalTranscriptRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcriptChunk
        } else {
          interim += transcriptChunk
        }
      }

      if (final) {
        finalTranscriptRef.current += final
      }

      setTranscript(finalTranscriptRef.current + interim)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please enable microphone permissions in your browser settings.')
      } else if (event.error === 'network') {
        setError('Network error. Speech recognition requires an active internet connection.')
      } else {
        setError(`Voice error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      // If we have a transcript when it ends naturally, send it
      const finalResult = finalTranscriptRef.current.trim()
      if (finalResult && onTranscript) {
        onTranscript(finalResult)
        setTranscript('')
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [onTranscript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  return { isListening, transcript, error, startListening, stopListening, setTranscript }
}
