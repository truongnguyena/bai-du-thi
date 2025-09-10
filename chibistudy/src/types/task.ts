export type TaskPriority = 'low' | 'med' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived'

export type TaskRecurrence = {
  freq: 'daily' | 'weekly' | 'monthly'
  until?: string
}

export type Task = {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt?: string
  dueDate?: string | null
  estimatedMinutes?: number
  actualMinutes?: number
  priority: TaskPriority
  rating?: number
  tags: string[]
  status: TaskStatus
  recurrence?: TaskRecurrence
  projectId?: string | null
  createdBy?: string
  procrastinationScore?: number
  autoScheduledAt?: string | null
}

export type CreateTaskInput = {
  title: string
  description?: string
  dueDate?: string | null
  estimatedMinutes?: number
  priority?: TaskPriority
  tags?: string[]
}

