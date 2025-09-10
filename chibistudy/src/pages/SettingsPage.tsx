import { useTranslation } from 'react-i18next'
import { syncNow } from '../api/sync'
import { useAIStore } from '../store/ai'
import { useTasksStore } from '../store/tasks'
import { exportTasksToExcel } from '../lib/exportExcel'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { status, lastTrainedAt, train, predictAll } = useAIStore()
  const tasks = useTasksStore((s) => s.items)
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
        <button
          className="ml-2 rounded-md border border-pink-300 px-3 py-2 text-sm hover:bg-pink-50"
          onClick={() => exportTasksToExcel(tasks)}
        >
          Xuất Excel
        </button>
        <div className="mt-2 text-xs text-slate-500">Yêu cầu cấu hình VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY</div>
      </div>
      <div className="rounded-md border border-pink-200 bg-white p-4">
        <div className="mb-2 text-sm font-medium text-pink-700">AI (tự học cục bộ)</div>
        <div className="flex items-center gap-2">
          <button onClick={train} className="rounded-md border border-pink-300 px-3 py-2 text-sm hover:bg-pink-50">Train</button>
          <button onClick={predictAll} className="rounded-md border border-pink-300 px-3 py-2 text-sm hover:bg-pink-50">Predict All</button>
          <span className="text-xs text-slate-600">Trạng thái: {status} {lastTrainedAt ? `· ${new Date(lastTrainedAt).toLocaleString()}` : ''}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">Mô hình được lưu trong IndexedDB của trình duyệt.</div>
      </div>
    </div>
  )
}

