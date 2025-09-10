import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    webkitSpeechRecognition?: any
    SpeechRecognition?: any
  }
}

type UseSpeechOptions = {
  lang?: string
  interimResults?: boolean
  continuous?: boolean
  onResult?: (finalText: string) => void
}

export function useSpeechRecognition(opts: UseSpeechOptions = {}) {
  const { lang = 'vi-VN', interimResults = false, continuous = false, onResult } = opts
  const recognitionRef = useRef<any | null>(null)
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = interimResults
    rec.continuous = continuous
    rec.onresult = (e: any) => {
      let text = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript
      }
      setTranscript(text)
      if (e.results[e.results.length - 1].isFinal) {
        onResult?.(text.trim())
      }
    }
    rec.onerror = (ev: any) => {
      setError(ev.error || 'speech_error')
      setListening(false)
    }
    rec.onend = () => {
      setListening(false)
    }
    recognitionRef.current = rec
    setSupported(true)
    return () => {
      try { rec.abort() } catch {}
      recognitionRef.current = null
    }
  }, [lang, interimResults, continuous, onResult])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript('')
    setError(null)
    setListening(true)
    try { recognitionRef.current.start() } catch {}
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try { recognitionRef.current.stop() } catch {}
  }, [])

  return { supported, listening, transcript, error, start, stop }
}

