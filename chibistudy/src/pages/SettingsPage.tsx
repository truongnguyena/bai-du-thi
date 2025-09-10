import { useTranslation } from 'react-i18next'
import { syncNow } from '../api/sync'

export default function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-pink-700">{t('settingsTitle')}</h1>
      <div className="rounded-md border border-pink-200 bg-white p-4">
        <button
          className="rounded-md bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600"
          onClick={() => syncNow()}
        >
          Đồng bộ ngay
        </button>
        <div className="mt-2 text-xs text-slate-500">Yêu cầu cấu hình VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY</div>
      </div>
    </div>
  )
}

