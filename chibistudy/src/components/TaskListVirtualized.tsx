import { Virtuoso } from 'react-virtuoso'
import { type Task } from '../types/task'
import TaskCard from './TaskCard'

type Props = {
  items: Task[]
  height?: number
}

export default function TaskListVirtualized({ items, height = 600 }: Props) {
  return (
    <div style={{ height }}>
      <Virtuoso
        totalCount={items.length}
        itemContent={(index) => (
          <div className="py-1">
            <TaskCard task={items[index]} />
          </div>
        )}
      />
    </div>
  )
}

