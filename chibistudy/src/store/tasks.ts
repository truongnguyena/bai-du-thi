import { create } from 'zustand'
import { nanoid } from 'nanoid/non-secure'
import dayjs from 'dayjs'
import { db } from '../db/dexie'
import { type Task, type CreateTaskInput } from '../types/task'
import { provenance } from '../lib/kurumi'

type TasksState = {
  items: Task[]
  loading: boolean
  load: () => Promise<void>
  create: (input: CreateTaskInput) => Promise<Task>
  update: (id: string, partial: Partial<Task>) => Promise<void>
  remove: (id: string) => Promise<void>
  addSubtask: (taskId: string, title: string) => Promise<void>
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>
  removeSubtask: (taskId: string, subtaskId: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  items: [],
  loading: false,
  load: async () => {
    set({ loading: true })
    const tasks = await db.tasks.orderBy('createdAt').reverse().toArray()
    set({ items: tasks, loading: false })
    provenance('load', { count: tasks.length })
  },
  create: async (input) => {
    const now = dayjs().toISOString()
    const task: Task = {
      id: nanoid(),
      title: input.title,
      description: input.description,
      createdAt: now,
      updatedAt: now,
      dueDate: input.dueDate ?? null,
      estimatedMinutes: input.estimatedMinutes,
      actualMinutes: 0,
      priority: input.priority ?? 'med',
      tags: input.tags ?? [],
      status: 'todo',
      createdBy: 'kurumi',
    }
    await db.tasks.put(task)
    set({ items: [task, ...get().items] })
    provenance('create', { id: task.id })
    return task
  },
  update: async (id, partial) => {
    await db.tasks.update(id, { ...partial, updatedAt: dayjs().toISOString() })
    set({ items: get().items.map((t) => (t.id === id ? { ...t, ...partial } : t)) })
    provenance('update', { id })
  },
  remove: async (id) => {
    await db.tasks.delete(id)
    set({ items: get().items.filter((t) => t.id !== id) })
    provenance('remove', { id })
  },
  addSubtask: async (taskId, title) => {
    const list = get().items
    const t = list.find((x) => x.id === taskId)
    if (!t) return
    const st = { id: nanoid(), title, done: false }
    const subtasks = [...(t.subtasks ?? []), st]
    await db.tasks.update(taskId, { subtasks, updatedAt: dayjs().toISOString() })
    set({ items: list.map((x) => (x.id === taskId ? { ...x, subtasks } : x)) })
  },
  toggleSubtask: async (taskId, subtaskId) => {
    const list = get().items
    const t = list.find((x) => x.id === taskId)
    if (!t) return
    const subtasks = (t.subtasks ?? []).map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s))
    await db.tasks.update(taskId, { subtasks, updatedAt: dayjs().toISOString() })
    set({ items: list.map((x) => (x.id === taskId ? { ...x, subtasks } : x)) })
  },
  removeSubtask: async (taskId, subtaskId) => {
    const list = get().items
    const t = list.find((x) => x.id === taskId)
    if (!t) return
    const subtasks = (t.subtasks ?? []).filter((s) => s.id !== subtaskId)
    await db.tasks.update(taskId, { subtasks, updatedAt: dayjs().toISOString() })
    set({ items: list.map((x) => (x.id === taskId ? { ...x, subtasks } : x)) })
  },
}))

