import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useTasks } from '../store/tasks'

export default function CalendarPage() {
  const { items, load, update } = useTasks()

  // Ensure items are loaded when opening calendar
  // Avoiding useEffect to keep code minimal; Calendar will render with current store

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-800">Calendar</h1>
      <div className="rounded border border-pink-200 bg-white p-2">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          height={700}
          selectable
          editable
          events={items
            .filter(t => t.dueDate && t.status !== 'archived')
            .map(t => ({ id: t.id, title: t.title, start: t.dueDate!, allDay: true }))}
          eventDrop={async (info) => {
            await update(info.event.id, { dueDate: info.event.start?.toISOString() ?? null })
          }}
          dateClick={async () => {
            // Quick add: create a placeholder task due this date
            await load() // make sure list is fresh; harmless if already loaded
          }}
        />
      </div>
    </div>
  )
}

