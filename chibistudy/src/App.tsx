import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GlobalTimerBar from './components/GlobalTimerBar'
import { useEffect } from 'react'
import { useAuthStore } from './store/auth'
import AmiAssistant from './components/AmiAssistant'

function App() {
  const { t, i18n } = useTranslation()
  const { user, init, signInWithGoogle, signOut } = useAuthStore()
  useEffect(() => { init() }, [init])
  return (
    <div className="h-full grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <aside className="row-span-2 bg-pink-100 border-r border-pink-200 p-4">
        <div className="mb-6">
          <div className="text-2xl font-extrabold text-pink-600">{t('appName')}</div>
          <div className="text-xs text-pink-500">{t('appTagline')}</div>
        </div>
        <nav className="space-y-1 text-sm">
          <NavLink to="/" end className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>{t('inbox')}</NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>{t('calendar')}</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>{t('analytics')}</NavLink>
          <NavLink to="/focus" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>{t('focus')}</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>{t('settings')}</NavLink>
        </nav>
      </aside>
      <header className="col-start-2 flex items-center justify-between border-b border-pink-200 bg-white/70 backdrop-blur px-4">
        <input className="w-1/2 rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300" placeholder={t('search') ?? ''} />
        <div className="flex items-center gap-3">
          <div className="text-xs text-pink-600">{t('helloAmi')}</div>
          <select
            aria-label={t('language') ?? 'Language'}
            className="rounded-md border border-pink-200 bg-white px-2 py-1 text-xs"
            value={i18n.language.startsWith('vi') ? 'vi' : 'en'}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="vi">{t('vi')}</option>
            <option value="en">{t('en')}</option>
          </select>
          {user ? (
            <button onClick={signOut} className="rounded-md border border-pink-300 px-2 py-1 text-xs hover:bg-pink-50">Logout</button>
          ) : (
            <button onClick={signInWithGoogle} className="rounded-md bg-pink-500 px-3 py-1 text-xs text-white hover:bg-pink-600">Login with Google</button>
          )}
          <div className="size-8 rounded-full bg-pink-300" />
        </div>
      </header>
      <main className="col-start-2 overflow-y-auto p-4">
        <Outlet />
      </main>
      <GlobalTimerBar />
      <AmiAssistant />
    </div>
  )
}

export default App
