import { create } from 'zustand'
import dayjs from 'dayjs'
import { useTasksStore } from './tasks'
import { provenance } from '../lib/kurumi'
import { useAmiStore } from './ami'

type TimerState = {
  activeTaskId: string | null
  startedAtIso: string | null
  targetMinutes?: number | null
  start: (taskId: string) => Promise<void>
  startWithTarget: (taskId: string, minutes: number) => Promise<void>
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
    set({ activeTaskId: taskId, startedAtIso: dayjs().toISOString(), targetMinutes: null })
    provenance('start', { id: taskId })
  },
  startWithTarget: async (taskId, minutes) => {
    await useTimerStore.getState().start(taskId)
    set({ targetMinutes: Math.max(1, Math.floor(minutes)) })
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
    const est = task?.estimatedMinutes ?? 0
    const diff = est > 0 ? newActual - est : null
    const msg = diff !== null ? (diff > 0 ? `Bạn vượt ước lượng ${diff} phút. Nghỉ ngơi chút nhé?` : `Bạn hoàn thành sớm ${Math.abs(diff)} phút! Rất tốt!`) : `Bạn đã làm ${elapsedMinutes} phút.`
    useAmiStore.getState().notify(`Timer kết thúc: ${msg}`)
  },
}))

