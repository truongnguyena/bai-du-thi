import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-pink-700">{t('settingsTitle')}</h1>
      <div className="rounded-md border border-pink-200 bg-white p-4">Settings placeholder</div>
    </div>
  )
}

