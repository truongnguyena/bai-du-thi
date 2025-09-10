import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { useTasksStore } from '../store/tasks'
import TaskCard from '../components/TaskCard'

const COLUMNS = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export default function BoardPage() {
  const { items, update } = useTasksStore()
  const [order, setOrder] = useState<Record<string, string[]>>({})
  const sensors = useSensors(useSensor(PointerSensor))

  const groups = useMemo(() => {
    const g: Record<string, string[]> = { todo: [], in_progress: [], done: [] }
    for (const t of items) {
      g[t.status] = g[t.status] || []
      g[t.status].push(t.id)
    }
    return g
  }, [items])

  const byId = useMemo(() => Object.fromEntries(items.map((t) => [t.id, t])), [items])

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!active || !over) return
    const [fromCol, id] = String(active.id).split(':')
    const toCol = String(over?.id ?? '')
    if (!id || !toCol) return
    if (fromCol !== toCol) {
      await update(id, { status: toCol as any })
    } else {
      // same column reorder (optional)
      const arr = [...(order[toCol] ?? groups[toCol] ?? [])]
      const oldIndex = arr.indexOf(id)
      const newIndex = arr.indexOf(String(e.over?.data?.current?.sortable?.items?.[0] ?? id))
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        const next = arrayMove(arr, oldIndex, newIndex)
        setOrder({ ...order, [toCol]: next })
      }
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-700">Board</h1>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.id} className="rounded-lg border border-pink-200 bg-white p-2">
              <div className="mb-2 text-sm font-medium text-pink-700">{col.title}</div>
              <SortableContext items={(order[col.id] ?? groups[col.id] ?? [])} strategy={rectSortingStrategy}>
                <div className="flex flex-col gap-2">
                  {(order[col.id] ?? groups[col.id] ?? []).map((taskId) => (
                    <DraggableTask key={taskId} columnId={col.id} id={taskId} task={byId[taskId]} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DraggableTask({ id, columnId, task }: { id: string; columnId: string; task: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `${columnId}:${id}` })
  const style = { transform: CSS.Transform.toString(transform), transition }
  if (!task) return null
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  )
}

