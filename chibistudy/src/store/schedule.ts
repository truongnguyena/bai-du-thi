import { create } from 'zustand'
import dayjs from 'dayjs'
import { useTasksStore } from './tasks'

export type Suggestion = {
  taskId: string
  startIso: string
  endIso: string
}

type ScheduleState = {
  suggestions: Suggestion[]
  suggest: () => void
  accept: (taskId: string) => Promise<void>
  clear: () => void
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  suggestions: [],
  suggest: () => {
    const { items } = useTasksStore.getState()
    // heuristic đơn giản: sắp xếp theo dueDate gần nhất, gán slot 1h vào buổi tối
    const sorted = [...items]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => dayjs(a.dueDate ?? Infinity).valueOf() - dayjs(b.dueDate ?? Infinity).valueOf())
      .slice(0, 5)
    const base = dayjs().hour(20).minute(0).second(0)
    const suggestions: Suggestion[] = []
    let cursor = base
    for (const t of sorted) {
      const dur = Math.max(30, (t.estimatedMinutes ?? 60))
      const start = cursor
      const end = start.add(dur, 'minute')
      suggestions.push({ taskId: t.id, startIso: start.toISOString(), endIso: end.toISOString() })
      cursor = end.add(10, 'minute')
    }
    set({ suggestions })
  },
  accept: async (taskId) => {
    const s = get().suggestions.find((x) => x.taskId === taskId)
    if (!s) return
    const tasks = useTasksStore.getState()
    await tasks.update(taskId, { autoScheduledAt: s.startIso, dueDate: s.endIso })
    set({ suggestions: get().suggestions.filter((x) => x.taskId !== taskId) })
  },
  clear: () => set({ suggestions: [] }),
}))

