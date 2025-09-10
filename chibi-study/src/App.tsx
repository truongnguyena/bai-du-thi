import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'

import InboxPage from './pages/InboxPage'
import CalendarPage from './pages/CalendarPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen grid grid-rows-[auto_1fr]">
        <Topbar />
        <div className="grid grid-cols-[220px_1fr]">
          <Sidebar />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/inbox" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-100'}`

  return (
    <aside className="border-r border-pink-200 bg-pink-50 p-3">
      <div className="px-2 pb-3 text-xs uppercase tracking-wider text-pink-700">ChibiStudy</div>
      <nav className="space-y-1">
        <NavLink to="/inbox" className={linkClass}>Inbox</NavLink>
        <NavLink to="/calendar" className={linkClass}>Calendar</NavLink>
        <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
      </nav>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-pink-200 bg-white/80 px-4 py-2 backdrop-blur">
      <div className="font-semibold text-pink-700">Ami — Hầu gái học tập</div>
      <input
        className="w-64 rounded border border-pink-200 bg-pink-50 px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="Tìm kiếm..."
      />
    </header>
  )
}

export default App
