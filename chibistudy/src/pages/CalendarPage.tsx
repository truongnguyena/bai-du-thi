import CalendarWrapper from '../components/CalendarWrapper'

export default function CalendarPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-pink-700">Calendar</h1>
      <p className="text-sm text-slate-600">Kéo thả để thay đổi dueDate.</p>
      <CalendarWrapper />
    </div>
  )
}

