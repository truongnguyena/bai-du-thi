import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useTasks } from './tasks'

type TimerState = {
  runningTaskId: string | null
  startedAt: number | null
  start: (taskId: string) => void
  stop: () => Promise<void>
}

export const useTimer = create<TimerState>()(devtools((set, get) => ({
  runningTaskId: null,
  startedAt: null,
  start: (taskId) => {
    set({ runningTaskId: taskId, startedAt: Date.now() })
  },
  stop: async () => {
    const { runningTaskId, startedAt } = get()
    if (!runningTaskId || !startedAt) return
    const minutes = Math.round((Date.now() - startedAt) / 60000)
    const { update } = useTasks.getState()
    await update(runningTaskId, ((prev: { actualMinutes?: number }) => ({
      actualMinutes: Math.max(0, (prev.actualMinutes ?? 0) + minutes),
      status: 'in_progress'
    })) as any)
    set({ runningTaskId: null, startedAt: null })
  }
})))

