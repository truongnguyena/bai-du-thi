import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { AmiPersona } from '../ai/persona'
import { useTasksStore } from '../store/tasks'
import { useScheduleStore } from '../store/schedule'
import { useMusicStore } from '../store/music'
import AmiSprite2D from './AmiSprite2D'
import { useAmiStore } from '../store/ami'

export default function AmiAssistant() {
  const [open, setOpen] = useState(true)
  const tasks = useTasksStore((s) => s.items)
  const hasOverdue = tasks.some((t) => t.dueDate && dayjs().isAfter(dayjs(t.dueDate)) && t.status !== 'done')
  const { suggestions, suggest } = useScheduleStore()
  const music = useMusicStore()
  const key = useMemo(() => {
    const hour = dayjs().hour()
    if (hasOverdue) return 'overdue'
    if (suggestions.length > 0) return 'schedule_suggest'
    if (hour >= 18) return 'greeting_evening'
    if (hour < 12) return 'greeting_morning'
    return 'encourage'
  }, [hasOverdue, suggestions]) as keyof typeof AmiPersona.messages
  const phrase = useMemo(() => {
    const arr = AmiPersona.messages[key]
    return arr[Math.floor(Math.random() * arr.length)]
  }, [key])
  const amiCue = useAmiStore((s) => s.cue)
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-2 max-w-xs rounded-2xl border border-pink-300 bg-white p-3 text-sm shadow-lg fade-in">
          <div className="mb-1 font-semibold text-pink-700">Ami (AI Hầu gái) {AmiPersona.visual.emoji}</div>
          <div className="text-slate-700">{amiCue || phrase}</div>
          <div className="mt-2 flex gap-2">
            <button onClick={suggest} className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50">Đề xuất lịch</button>
            <a href="/focus" className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50">Focus 25m</a>
            <button onClick={() => music.setVisible(true)} className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50">Nhạc</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((x) => !x)}
        className="flex items-center gap-2 rounded-full border border-pink-300 bg-pink-100 px-3 py-2 shadow"
        title="Ami — tóc trắng, mắt đỏ, đồ hầu gái chibi"
      >
        <AmiSprite2D />
        <span className="text-pink-700 text-sm font-medium">Ami</span>
      </button>
    </div>
  )
}

