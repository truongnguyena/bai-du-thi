import { useEffect, useState } from 'react'
import { List } from 'react-window'
import { useTasks } from '../store/tasks'
import { useTimer } from '../store/timer'

export default function InboxPage() {
  const { items, load, add, remove, update, seed } = useTasks()
  const [title, setTitle] = useState('')

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async () => {
    if (!title.trim()) return
    await add({
      title: title.trim(),
      description: '',
      dueDate: null,
      estimatedMinutes: 30,
      priority: 'med',
      tags: [],
      status: 'todo',
      projectId: null
    })
    setTitle('')
  }

  function Row({ index, style }: { index: number; style: React.CSSProperties }) {
    const task = items[index]
    const { runningTaskId, start, stop } = useTimer()
    return (
      <div style={style} className="flex items-center justify-between border-b border-pink-100 px-3">
        <div>
          <div className="font-medium text-pink-900">{task.title}</div>
          <div className="text-xs text-pink-700">{task.status} • {task.priority}</div>
        </div>
        <div className="flex items-center gap-2">
          {runningTaskId === task.id ? (
            <button className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200" onClick={stop}>Stop</button>
          ) : (
            <button className="rounded bg-pink-100 px-2 py-1 text-xs text-pink-800 hover:bg-pink-200" onClick={() => start(task.id)}>Start</button>
          )}
          <button
            className="rounded bg-pink-100 px-2 py-1 text-xs text-pink-800 hover:bg-pink-200"
            onClick={() => update(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
          >
            {task.status === 'done' ? 'Mark Todo' : 'Mark Done'}
          </button>
          <button
            className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
            onClick={() => remove(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-800">Inbox</h1>
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thêm nhiệm vụ mới..."
          className="flex-1 rounded border border-pink-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button onClick={handleAdd} className="rounded bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600">Add</button>
        <button onClick={() => seed(100)} className="rounded bg-pink-100 px-3 py-2 text-sm font-medium text-pink-800 hover:bg-pink-200">Seed 100</button>
      </div>
      <div className="rounded border border-pink-200 bg-white">
        <List
          className="h-[480px] w-full"
          defaultHeight={480}
          rowCount={items.length}
          rowHeight={64}
          rowProps={{}}
          rowComponent={({ index, style }) => <Row index={index} style={style as React.CSSProperties} />}
        />
      </div>
    </div>
  )
}

