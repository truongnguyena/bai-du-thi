import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import './i18n'
import { installKurumi } from './lib/kurumi'
import AnimeLoader from './components/AnimeLoader'

const InboxPage = lazy(() => import('./pages/InboxPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const FocusPage = lazy(() => import('./pages/FocusPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InboxPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'focus', element: <FocusPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])

installKurumi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<AnimeLoader /> }>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
