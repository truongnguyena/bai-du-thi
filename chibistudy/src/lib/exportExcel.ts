import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { type Task } from '../types/task'

export function exportTasksToExcel(tasks: Task[]) {
  const rows = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    createdAt: t.createdAt,
    updatedAt: t.updatedAt ?? '',
    dueDate: t.dueDate ?? '',
    estimatedMinutes: t.estimatedMinutes ?? '',
    actualMinutes: t.actualMinutes ?? '',
    priority: t.priority,
    rating: t.rating ?? '',
    tags: (t.tags ?? []).join(','),
    status: t.status,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tasks')
  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, 'chibistudy_tasks.xlsx')
}

