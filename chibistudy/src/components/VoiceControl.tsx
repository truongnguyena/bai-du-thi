import { useState, useCallback } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeech'
import { useTasksStore } from '../store/tasks'
import dayjs from 'dayjs'
import { useScheduleStore } from '../store/schedule'
import { useMusicStore } from '../store/music'

export default function VoiceControl() {
  const [last, setLast] = useState('')
  const tasks = useTasksStore()
  const sched = useScheduleStore()
  const music = useMusicStore()

  const onResult = useCallback(async (text: string) => {
    setLast(text)
    const lower = text.toLowerCase()
    // Lệnh cơ bản:
    // "tạo nhiệm vụ <tiêu đề>"
    const createMatch = lower.match(/tạo nhiệm vụ (.+)/)
    if (createMatch) {
      await tasks.create({ title: createMatch[1] })
      return
    }
    // "đặt hạn <giờ> cho <tên>" (đơn giản)
    const deadlineMatch = lower.match(/đặt hạn (\d{1,2})\s*h(?:\s*(\d{1,2}))? cho (.+)/)
    if (deadlineMatch) {
      const hour = Number(deadlineMatch[1])
      const minute = Number(deadlineMatch[2] ?? '0')
      const title = deadlineMatch[3]
      const t = tasks.items.find((x) => x.title.toLowerCase().includes(title))
      if (t) {
        const d = dayjs().hour(hour).minute(minute)
        await tasks.update(t.id, { dueDate: d.toISOString() })
      }
      return
    }
    // "đề xuất lịch"
    if (lower.includes('đề xuất lịch')) {
      sched.suggest()
      return
    }
    // "phát nhạc" hoặc "mở nhạc"
    if (lower.includes('phát nhạc') || lower.includes('mở nhạc')) {
      music.setVisible(true)
      return
    }
  }, [tasks, sched, music])

  const { supported, listening, start, stop } = useSpeechRecognition({ onResult, lang: 'vi-VN', interimResults: false })

  if (!supported) return null
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="mb-1 text-xs text-slate-600">Voice: {listening ? 'Đang nghe…' : 'Tắt'}</div>
      <div className="flex gap-2">
        {!listening ? (
          <button onClick={start} className="rounded-md bg-pink-500 px-3 py-1 text-xs text-white hover:bg-pink-600">Bắt đầu nghe</button>
        ) : (
          <button onClick={stop} className="rounded-md border border-pink-300 px-3 py-1 text-xs hover:bg-pink-50">Dừng</button>
        )}
      </div>
      {last && <div className="mt-1 max-w-xs truncate text-xs text-slate-500">“{last}”</div>}
    </div>
  )
}

