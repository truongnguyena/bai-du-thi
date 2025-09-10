export type Priority = 'low' | 'med' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived'

export type Recurrence = {
  freq: 'daily' | 'weekly' | 'monthly'
  until?: string
}

export type Task = {
  id: string
  title: string
  description?: string
  createdAt: string
  dueDate?: string | null
  estimatedMinutes?: number
  actualMinutes?: number
  priority: Priority
  tags: string[]
  status: TaskStatus
  recurrence?: Recurrence
  projectId?: string | null
  createdBy?: string
  procrastinationScore?: number
  autoScheduledAt?: string | null
}

