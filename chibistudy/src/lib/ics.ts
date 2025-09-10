import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { type Task } from '../types/task'

dayjs.extend(utc)

function foldLine(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = []
  let i = 0
  while (i < line.length) {
    chunks.push(line.slice(i, i + 75))
    i += 75
  }
  return chunks.join('\r\n ')
}

export function buildIcsForTask(task: Task): string {
  const uid = `${task.id}@chibistudy`
  const dtstamp = dayjs().utc().format('YYYYMMDDTHHmmss[Z]')
  const start = task.dueDate ? dayjs(task.dueDate) : dayjs()
  const end = start.add(task.estimatedMinutes ?? 30, 'minute')
  const dtstart = start.utc().format('YYYYMMDDTHHmmss[Z]')
  const dtend = end.utc().format('YYYYMMDDTHHmmss[Z]')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChibiStudy//VN Student Time Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    foldLine(`UID:${uid}`),
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    foldLine(`SUMMARY:${task.title}`),
    foldLine(`DESCRIPTION:${task.description ?? ''}`),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadIcs(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

