import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useTasksStore } from '../store/tasks'
import dayjs from 'dayjs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const items = useTasksStore((s) => s.items)

  const summary = useMemo(() => {
    const total = items.length
    const completed = items.filter((x) => x.status === 'done').length
    const overdue = items.filter((x) => x.dueDate && dayjs().isAfter(dayjs(x.dueDate)) && x.status !== 'done').length
    const estTotal = items.reduce((acc, x) => acc + (x.estimatedMinutes ?? 0), 0)
    const actualTotal = items.reduce((acc, x) => acc + (x.actualMinutes ?? 0), 0)
    return { total, completed, overdue, estTotal, actualTotal }
  }, [items])

  const createdByDay = useMemo(() => {
    const days: { date: string; count: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
      days.push({ date: d, count: 0 })
    }
    for (const t of items) {
      const d = dayjs(t.createdAt).format('YYYY-MM-DD')
      const slot = days.find((x) => x.date === d)
      if (slot) slot.count += 1
    }
    return days
  }, [items])
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-pink-700">{t('analytics')}</h1>
      <div className="rounded-md border border-pink-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Stat label={t('total')!} value={summary.total.toString()} />
          <Stat label={t('completed')!} value={summary.completed.toString()} />
          <Stat label={t('overdue')!} value={summary.overdue.toString()} />
          <Stat label={t('estTotal')!} value={`${summary.estTotal} ${t('minutes')}`.trim()} />
          <Stat label={t('actualTotal')!} value={`${summary.actualTotal} ${t('minutes')}`.trim()} />
        </div>
      </div>
      <div className="rounded-md border border-pink-200 bg-white p-4">
        <div className="mb-2 text-sm text-slate-600">{t('tasksCreated')} · {t('last14Days')}</div>
        {items.length === 0 ? (
          <div className="text-slate-500">{t('noData')}</div>
        ) : (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={createdByDay} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => dayjs(d).format('DD/MM')} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(d) => dayjs(d as string).format('DD/MM/YYYY')} />
                <Legend />
                <Bar dataKey="count" name={t('tasksCreated')!} fill="#FF69B4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-pink-200 bg-pink-50 p-3">
      <div className="text-xs text-pink-600">{label}</div>
      <div className="text-xl font-semibold text-pink-800">{value}</div>
    </div>
  )
}

