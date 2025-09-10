import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useTasksStore } from '../store/tasks'
import { type Task } from '../types/task'
import { useTranslation } from 'react-i18next'
import { useTimerStore } from '../store/timer'
import { buildIcsForTask, downloadIcs } from '../lib/ics'
import { useState } from 'react'

dayjs.extend(utc)

type Props = {
  task: Task
}

export default function TaskCard({ task }: Props) {
  const { t } = useTranslation()
  const update = useTasksStore((s) => s.update)
  const remove = useTasksStore((s) => s.remove)
  const addSubtask = useTasksStore((s) => s.addSubtask)
  const toggleSubtask = useTasksStore((s) => s.toggleSubtask)
  const removeSubtask = useTasksStore((s) => s.removeSubtask)
  const { activeTaskId, start, stop, startWithTarget } = useTimerStore()
  const [newSub, setNewSub] = useState('')
  const toGoogleCalendarUrl = () => {
    const base = 'https://calendar.google.com/calendar/r/eventedit'
    const text = encodeURIComponent(task.title)
    const details = encodeURIComponent(task.description ?? '')
    const dates = task.dueDate ? dayjs(task.dueDate).utc().format('YYYYMMDDTHHmmss[Z]') : null
    const end = task.dueDate ? dayjs(task.dueDate).add(task.estimatedMinutes ?? 30, 'minute').utc().format('YYYYMMDDTHHmmss[Z]') : null
    const timeRange = dates && end ? `&dates=${dates}/${end}` : ''
    return `${base}?text=${text}&details=${details}${timeRange}`
  }

  const isOverdue = task.dueDate ? dayjs().isAfter(dayjs(task.dueDate)) && task.status !== 'done' : false

  return (
    <div className="flex items-start justify-between rounded-lg border border-pink-200 bg-white p-3 hover-lift fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 accent-pink-500"
            checked={task.status === 'done'}
            onChange={(e) => update(task.id, { status: e.target.checked ? 'done' : 'todo' })}
          />
          <div className={`font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</div>
          {task.priority === 'high' && <span className="rounded bg-pink-100 px-2 py-0.5 text-xs text-pink-700">{t('high')}</span>}
        </div>
        <div className="text-xs text-slate-500">
          {task.dueDate ? (
            <span className={isOverdue ? 'text-red-600' : ''}>
              {t('due')} {dayjs(task.dueDate).format('DD/MM HH:mm')}
            </span>
          ) : (
            <span>{t('noDue')}</span>
          )}
          {typeof task.estimatedMinutes === 'number' && (
            <span> · Est {task.estimatedMinutes}m</span>
          )}
          {typeof task.actualMinutes === 'number' && task.actualMinutes > 0 && (
            <span>
              {' '}· Actual {task.actualMinutes}m
              {typeof task.estimatedMinutes === 'number' && task.estimatedMinutes > 0 && (
                <>
                  {' '}(
                  {Math.round(((task.actualMinutes ?? 0) / (task.estimatedMinutes ?? 1)) * 100)}%
                  )
                </>
              )}
            </span>
          )}
        </div>
        {task.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((t) => (
              <span key={t} className="rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-700 border border-pink-200">#{t}</span>
            ))}
          </div>
        ) : null}
        <div className="rounded-md border border-pink-100 bg-pink-50 p-2">
          <div className="mb-1 text-xs font-medium text-pink-700">Checklist</div>
          <div className="space-y-1">
            {(task.subtasks ?? []).map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-pink-500" checked={s.done} onChange={() => toggleSubtask(task.id, s.id)} />
                  <span className={s.done ? 'line-through text-slate-400' : ''}>{s.title}</span>
                </label>
                <button onClick={() => removeSubtask(task.id, s.id)} className="rounded-md border border-pink-300 px-2 py-0.5 text-xs hover:bg-pink-100">X</button>
              </div>
            ))}
            <form
              onSubmit={(e) => { e.preventDefault(); if (newSub.trim()) { void addSubtask(task.id, newSub.trim()); setNewSub('') } }}
              className="flex items-center gap-2"
            >
              <input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="Thêm mục…" className="flex-1 rounded-md border border-pink-200 px-2 py-1 text-sm" />
              <button className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-100">Thêm</button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-yellow-500">
          {[1,2,3,4,5].map((n) => (
            <button key={n} onClick={() => update(task.id, { rating: n })} aria-label={`rate-${n}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={((task.rating ?? 0) >= n) ? 'currentColor' : 'none'} stroke="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </button>
          ))}
        </div>
        {activeTaskId === task.id ? (
          <button
            className="rounded-md bg-pink-500 px-2 py-1 text-xs text-white hover:bg-pink-600"
            onClick={() => stop()}
          >
            Stop
          </button>
        ) : (
          <>
            <button
              className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50"
              onClick={() => start(task.id)}
            >
              Start
            </button>
            <button
              className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50"
              onClick={() => startWithTarget(task.id, 25)}
            >
              Focus 25m
            </button>
          </>
        )}
        <button
          className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50"
          onClick={() => downloadIcs(`${task.title}.ics`, buildIcsForTask(task))}
        >
          ICS
        </button>
        <a
          href={toGoogleCalendarUrl()}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50"
        >
          GCal
        </a>
        <button
          className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50"
          onClick={() => remove(task.id)}
        >
          Xoá
        </button>
      </div>
    </div>
  )
}

