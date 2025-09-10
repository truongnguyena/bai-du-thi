import CalendarWrapper from '../components/CalendarWrapper'
import { useTranslation } from 'react-i18next'

export default function CalendarPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-pink-700">{t('calendar')}</h1>
      <p className="text-sm text-slate-600">{t('calendarTip')}</p>
      <CalendarWrapper />
    </div>
  )
}

