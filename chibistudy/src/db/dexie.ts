import Dexie, { type EntityTable } from 'dexie'
import { type Task } from '../types/task'

export class ChibiDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>

  constructor() {
    super('chibistudy')
    this.version(1).stores({
      tasks: 'id, status, dueDate, createdAt, priority',
    })
  }
}

export const db = new ChibiDB()

