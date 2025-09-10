import { create } from 'zustand'
import dayjs from 'dayjs'
import { useTasksStore } from './tasks'
import { provenance } from '../lib/kurumi'

type TimerState = {
  activeTaskId: string | null
  startedAtIso: string | null
  start: (taskId: string) => Promise<void>
  stop: () => Promise<void>
}

export const useTimerStore = create<TimerState>((set, get) => ({
  activeTaskId: null,
  startedAtIso: null,
  start: async (taskId) => {
    const tasks = useTasksStore.getState()
    const task = tasks.items.find((t) => t.id === taskId)
    if (!task) return
    if (get().activeTaskId && get().activeTaskId !== taskId) {
      await get().stop()
    }
    await tasks.update(taskId, { status: 'in_progress' })
    set({ activeTaskId: taskId, startedAtIso: dayjs().toISOString() })
    provenance('start', { id: taskId })
  },
  stop: async () => {
    const { activeTaskId, startedAtIso } = get()
    if (!activeTaskId || !startedAtIso) return
    const tasks = useTasksStore.getState()
    const task = tasks.items.find((t) => t.id === activeTaskId)
    const elapsedMinutes = Math.max(1, Math.round(dayjs().diff(dayjs(startedAtIso), 'minute', true)))
    const newActual = (task?.actualMinutes ?? 0) + elapsedMinutes
    await tasks.update(activeTaskId, { actualMinutes: newActual })
    set({ activeTaskId: null, startedAtIso: null })
    provenance('stop', { id: activeTaskId, elapsedMinutes })
  },
}))

