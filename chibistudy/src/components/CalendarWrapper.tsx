import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import { useTasksStore } from '../store/tasks'
import { useScheduleStore } from '../store/schedule'

export default function CalendarWrapper() {
  const { items, update } = useTasksStore()
  const { suggestions, suggest, accept, clear } = useScheduleStore()

  return (
    <div className="rounded-md border border-pink-200 bg-white p-2">
      <div className="mb-2 flex items-center gap-2">
        <button onClick={suggest} className="rounded-md bg-pink-500 px-3 py-1 text-sm text-white hover:bg-pink-600">Đề xuất lịch</button>
        {suggestions.length > 0 && (
          <>
            <span className="text-xs text-slate-600">{suggestions.length} gợi ý</span>
            <button onClick={clear} className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50">Xoá gợi ý</button>
          </>
        )}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height={720}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        nowIndicator
        editable
        droppable={false}
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        events={[
          ...items
          .filter((t) => t.dueDate)
          .map((t) => ({ id: t.id, title: t.title, start: t.dueDate!, end: t.dueDate!, allDay: false })),
          ...suggestions.map((s) => ({ id: `s-${s.taskId}`, title: `Suggest: ${items.find(i => i.id === s.taskId)?.title ?? ''}`, start: s.startIso, end: s.endIso, color: '#FFB6C1' })),
        ]}
        eventDrop={async (info) => {
          await update(info.event.id, { dueDate: dayjs(info.event.start).toISOString() })
        }}
        dateClick={() => {}}
        eventClick={(info) => {
          if (info.event.id.startsWith('s-')) {
            const taskId = info.event.id.slice(2)
            void accept(taskId)
          }
        }}
      />
    </div>
  )
}

