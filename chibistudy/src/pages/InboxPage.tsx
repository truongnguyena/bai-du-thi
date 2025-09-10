import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useTasksStore } from '../store/tasks'
import TaskCard from '../components/TaskCard'
import TaskListVirtualized from '../components/TaskListVirtualized'

export default function InboxPage() {
  const { items, load, create } = useTasksStore()
  const [title, setTitle] = useState('')
  const [due, setDue] = useState<string>('')
  const [estimate, setEstimate] = useState<string>('')
  const [tags, setTags] = useState<string>('')

  useEffect(() => {
    load()
  }, [load])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await create({
      title: title.trim(),
      dueDate: due ? dayjs(due).toISOString() : null,
      estimatedMinutes: estimate ? Number(estimate) : undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    setTitle('')
    setDue('')
    setEstimate('')
    setTags('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-700">Inbox</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-2 rounded-lg border border-pink-200 bg-white p-3 md:grid-cols-[1fr_200px_140px_1fr_auto]">
        <input
          className="rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Thêm nhiệm vụ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          className="rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <input
          type="number"
          min={0}
          className="rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Ước lượng (phút)"
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
        />
        <input
          className="rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="tags, cách nhau bằng dấu phẩy"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button className="rounded-md bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600">Thêm</button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-md border border-pink-200 bg-white p-6 text-center text-slate-500">Chưa có nhiệm vụ nào</div>
      ) : items.length > 20 ? (
        <TaskListVirtualized items={items} height={600} />
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  )
}

