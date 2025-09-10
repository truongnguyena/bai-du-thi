import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import { useTasksStore } from '../store/tasks'

export default function CalendarWrapper() {
  const { items, update } = useTasksStore()

  return (
    <div className="rounded-md border border-pink-200 bg-white p-2">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height={720}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        nowIndicator
        editable
        droppable={false}
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        events={items
          .filter((t) => t.dueDate)
          .map((t) => ({ id: t.id, title: t.title, start: t.dueDate!, end: t.dueDate!, allDay: false }))}
        eventDrop={async (info) => {
          await update(info.event.id, { dueDate: dayjs(info.event.start).toISOString() })
        }}
        dateClick={() => {}}
      />
    </div>
  )
}

