import { NavLink, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="h-full grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <aside className="row-span-2 bg-pink-100 border-r border-pink-200 p-4">
        <div className="mb-6">
          <div className="text-2xl font-extrabold text-pink-600">ChibiStudy</div>
          <div className="text-xs text-pink-500">VN Student Time Manager</div>
        </div>
        <nav className="space-y-1 text-sm">
          <NavLink to="/" end className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>Inbox</NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>Calendar</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>Analytics</NavLink>
          <NavLink to="/focus" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>Focus</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `block rounded px-3 py-2 ${isActive ? 'bg-pink-200 text-pink-900' : 'hover:bg-pink-50'}`}>Settings</NavLink>
        </nav>
      </aside>
      <header className="col-start-2 flex items-center justify-between border-b border-pink-200 bg-white/70 backdrop-blur px-4">
        <input className="w-1/2 rounded-md border border-pink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300" placeholder="Search tasks..." />
        <div className="flex items-center gap-3">
          <div className="text-xs text-pink-600">Hello, Ami ♡</div>
          <div className="size-8 rounded-full bg-pink-300" />
        </div>
      </header>
      <main className="col-start-2 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default App
