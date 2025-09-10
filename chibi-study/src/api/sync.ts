// Minimal sync stub to illustrate where remote sync (e.g., Supabase) would go.
// This file can be extended to push/pull tasks to a backend.

import type { Task } from '../types/task'

export type SyncResult = {
  pushed: number
  pulled: number
}

export async function syncTasks(_tasks: Task[]): Promise<SyncResult> {
  // Placeholder: no-op in preliminary phase
  await new Promise((r) => setTimeout(r, 50))
  return { pushed: 0, pulled: 0 }
}

