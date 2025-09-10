import Dexie, { type Table } from 'dexie'
import type { Task } from '../types/task'

export class ChibiStudyDB extends Dexie {
  tasks!: Table<Task, string>

  constructor() {
    super('ChibiStudyDB')
    this.version(1).stores({
      tasks: 'id, status, priority, dueDate, createdAt'
    })
  }
}

export const db = new ChibiStudyDB()

