import dayjs from 'dayjs'
import { db } from '../db/dexie'
import { supabase } from '../lib/supabase'
import { type Task } from '../types/task'

const TABLE = 'tasks'

export async function pushTasks(tasks: Task[]) {
  if (!supabase) return { error: 'no_supabase' as const }
  const payload = tasks.map((t) => ({ ...t, tags: t.tags ?? [] }))
  const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'id' })
  return { error: error?.message }
}

export async function pullTasks(updatedAfterIso?: string) {
  if (!supabase) return { error: 'no_supabase' as const }
  let q = supabase.from(TABLE).select('*')
  if (updatedAfterIso) {
    q = q.gte('updatedAt', updatedAfterIso)
  }
  const { data, error } = await q
  if (error) return { error: error.message }
  const tasks = (data ?? []) as Task[]
  // merge into local by last-write-wins
  for (const t of tasks) {
    const local = await db.tasks.get(t.id)
    const localUpdated = local?.updatedAt ?? local?.createdAt ?? '1970-01-01T00:00:00.000Z'
    const remoteUpdated = t.updatedAt ?? t.createdAt
    if (!local || dayjs(remoteUpdated).isAfter(dayjs(localUpdated))) {
      await db.tasks.put(t)
    }
  }
  return { count: tasks.length }
}

export async function syncNow() {
  const all = await db.tasks.toArray()
  await pushTasks(all)
  await pullTasks()
}

