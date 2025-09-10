import { create } from 'zustand'
import { nanoid } from 'nanoid/non-secure'
import dayjs from 'dayjs'
import { db } from '../db/dexie'
import { type Task, type CreateTaskInput } from '../types/task'

type TasksState = {
  items: Task[]
  loading: boolean
  load: () => Promise<void>
  create: (input: CreateTaskInput) => Promise<Task>
  update: (id: string, partial: Partial<Task>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  items: [],
  loading: false,
  load: async () => {
    set({ loading: true })
    const tasks = await db.tasks.orderBy('createdAt').reverse().toArray()
    set({ items: tasks, loading: false })
  },
  create: async (input) => {
    const now = dayjs().toISOString()
    const task: Task = {
      id: nanoid(),
      title: input.title,
      description: input.description,
      createdAt: now,
      dueDate: input.dueDate ?? null,
      estimatedMinutes: input.estimatedMinutes,
      actualMinutes: 0,
      priority: input.priority ?? 'med',
      tags: input.tags ?? [],
      status: 'todo',
    }
    await db.tasks.put(task)
    set({ items: [task, ...get().items] })
    return task
  },
  update: async (id, partial) => {
    await db.tasks.update(id, partial)
    set({ items: get().items.map((t) => (t.id === id ? { ...t, ...partial } : t)) })
  },
  remove: async (id) => {
    await db.tasks.delete(id)
    set({ items: get().items.filter((t) => t.id !== id) })
  },
}))

