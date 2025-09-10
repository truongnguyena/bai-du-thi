import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { db } from '../db/dexie'
import type { Task, TaskStatus, Priority } from '../types/task'

type TaskFilters = {
  query?: string
  status?: TaskStatus | 'all'
  tag?: string
}

type TasksState = {
  items: Task[]
  loading: boolean
  filters: TaskFilters
  load: () => Promise<void>
  add: (input: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>
  update: (id: string, updates: Partial<Task>) => Promise<void>
  remove: (id: string) => Promise<void>
  setFilters: (filters: TaskFilters) => void
  seed: (count: number) => Promise<void>
}

const generateId = () => crypto.randomUUID()
const nowIso = () => new Date().toISOString()

export const useTasks = create<TasksState>()(devtools((set, get) => ({
  items: [],
  loading: false,
  filters: { status: 'all' },

  load: async () => {
    set({ loading: true })
    const all = await db.tasks.orderBy('createdAt').reverse().toArray()
    set({ items: all, loading: false })
  },

  add: async (input) => {
    const task: Task = { id: generateId(), createdAt: nowIso(), ...input }
    await db.tasks.put(task)
    set({ items: [task, ...get().items] })
    return task
  },

  update: async (id, updates) => {
    await db.tasks.update(id, updates)
    set({ items: get().items.map(t => t.id === id ? { ...t, ...updates } : t) })
  },

  remove: async (id) => {
    await db.tasks.delete(id)
    set({ items: get().items.filter(t => t.id !== id) })
  },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  seed: async (count) => {
    const priorities: Priority[] = ['low', 'med', 'high']
    const tasks: Task[] = Array.from({ length: count }).map((_, i) => ({
      id: generateId(),
      title: `Sample Task ${i + 1}`,
      description: 'Demo item',
      createdAt: nowIso(),
      dueDate: Math.random() > 0.5 ? new Date(Date.now() + (i % 10) * 86400000).toISOString() : null,
      estimatedMinutes: [25, 30, 45, 60, 90][i % 5],
      actualMinutes: undefined,
      priority: priorities[i % 3],
      tags: ['demo', i % 2 === 0 ? 'school' : 'life'],
      status: ['todo', 'in_progress', 'done'][i % 3] as TaskStatus,
      projectId: null,
      procrastinationScore: Math.round(Math.random() * 100) / 100,
      autoScheduledAt: null
    }))

    await db.transaction('rw', db.tasks, async () => {
      await db.tasks.bulkPut(tasks)
    })
    set({ items: [...tasks, ...get().items] })
  }
})))

