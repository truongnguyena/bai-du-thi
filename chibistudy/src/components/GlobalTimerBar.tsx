import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useMemo, useState } from 'react'
import { useTimerStore } from '../store/timer'
import { useTasksStore } from '../store/tasks'

dayjs.extend(relativeTime)

export default function GlobalTimerBar() {
  const { activeTaskId, startedAtIso, stop, targetMinutes } = useTimerStore()
  const task = useTasksStore((s) => s.items.find((t) => t.id === activeTaskId))
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!activeTaskId) return
    const id = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [activeTaskId])

  const remaining = useMemo(() => {
    if (!startedAtIso || !targetMinutes) return null
    const end = dayjs(startedAtIso).add(targetMinutes, 'minute')
    const diff = end.diff(dayjs(), 'second')
    return diff
  }, [startedAtIso, targetMinutes, tick])

  useEffect(() => {
    if (remaining !== null && remaining <= 0) {
      void stop()
    }
  }, [remaining, stop])

  if (!activeTaskId || !startedAtIso || !task) return null
  const elapsed = dayjs().diff(dayjs(startedAtIso), 'minute')

  return (
    <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full border border-pink-300 bg-white/90 px-4 py-2 shadow-md backdrop-blur">
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded bg-pink-100 px-2 py-0.5 text-xs text-pink-700">Timer</span>
        <span className="font-medium">{task.title}</span>
        <span className="text-slate-500">{elapsed}m</span>
        {targetMinutes ? (
          <span className="text-pink-700">{Math.max(0, Math.floor((remaining ?? 0) / 60))}:{String(Math.max(0, (remaining ?? 0) % 60)).padStart(2, '0')}</span>
        ) : null}
        <button onClick={stop} className="rounded-md bg-pink-500 px-3 py-1 text-white hover:bg-pink-600">Stop</button>
        <span className="hidden">{tick}</span>
      </div>
    </div>
  )
}

