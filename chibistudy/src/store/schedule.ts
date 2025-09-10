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
    // Heuristic nâng cao: ưu tiên HIGH > MED > LOW, hạn gần trước, phân bổ 7 ngày tới
    const backlog = [...items].filter((t) => t.status !== 'done')
    const priorityScore: Record<string, number> = { high: 0, med: 1, low: 2 }
    const sorted = backlog.sort((a, b) => {
      const pa = priorityScore[a.priority ?? 'med'] ?? 1
      const pb = priorityScore[b.priority ?? 'med'] ?? 1
      if (pa !== pb) return pa - pb
      const da = dayjs(a.dueDate ?? '9999-12-31')
      const db = dayjs(b.dueDate ?? '9999-12-31')
      return da.valueOf() - db.valueOf()
    })

    // Lịch khả dụng 19:00–23:00 trong 7 ngày tới, mỗi ngày tối đa 3 giờ
    const capacityPerDay = 180
    const windowStartHour = 19
    const windowEndHour = 23
    const dayCapacity: Record<string, number> = {}
    const dayCursor: Record<string, string> = {}
    for (let i = 0; i < 7; i++) {
      const d = dayjs().add(i, 'day').hour(windowStartHour).minute(0).second(0)
      const key = d.format('YYYY-MM-DD')
      dayCapacity[key] = capacityPerDay
      dayCursor[key] = d.toISOString()
    }

    const suggestions: Suggestion[] = []
    for (const t of sorted) {
      let remaining = Math.max(30, t.estimatedMinutes ?? 60)
      // Ưu tiên trước ngày deadline nếu có
      const deadline = t.dueDate ? dayjs(t.dueDate) : null
      const dayKeys = Object.keys(dayCapacity).sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())
      for (const key of dayKeys) {
        const dayStart = dayjs(dayCursor[key])
        const endOfWindow = dayStart.hour(windowEndHour).minute(0)
        if (deadline && dayStart.isAfter(deadline)) continue
        if (dayCapacity[key] <= 0) continue
        const slot = Math.min(remaining, dayCapacity[key], endOfWindow.diff(dayStart, 'minute'))
        if (slot <= 0) continue
        const start = dayStart
        const end = start.add(slot, 'minute')
        suggestions.push({ taskId: t.id, startIso: start.toISOString(), endIso: end.toISOString() })
        remaining -= slot
        dayCapacity[key] -= slot
        dayCursor[key] = end.add(5, 'minute').toISOString()
        if (remaining <= 0) break
      }
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

