import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { useTasks } from '../store/tasks'

export default function AnalyticsPage() {
  const { items } = useTasks()

  const byPriority = useMemo(() => {
    const groups: Record<string, number> = { low: 0, med: 0, high: 0 }
    items.forEach(t => groups[t.priority] = (groups[t.priority] ?? 0) + 1)
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [items])

  const estimateVsActual = useMemo(() => {
    const done = items.filter(t => t.status === 'done' && (t.estimatedMinutes || t.actualMinutes))
    const byDay: Record<string, { estimated: number; actual: number }> = {}
    done.forEach(t => {
      const key = (t.dueDate ?? t.createdAt).slice(0, 10)
      byDay[key] ||= { estimated: 0, actual: 0 }
      byDay[key].estimated += t.estimatedMinutes ?? 0
      byDay[key].actual += t.actualMinutes ?? t.estimatedMinutes ?? 0
    })
    return Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v }))
  }, [items])

  const COLORS = ['#A7F3D0', '#FDE68A', '#FCA5A5']

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-pink-800">Analytics</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded border border-pink-200 bg-white p-4">
          <div className="mb-2 font-semibold text-pink-800">Tasks by Priority</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byPriority} dataKey="value" nameKey="name" outerRadius={100} label>
                {byPriority.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded border border-pink-200 bg-white p-4">
          <div className="mb-2 font-semibold text-pink-800">Estimate vs Actual (minutes per day)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={estimateVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="estimated" fill="#93C5FD" name="Estimated" />
              <Bar dataKey="actual" fill="#F472B6" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

