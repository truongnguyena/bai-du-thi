import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import InboxPage from './pages/InboxPage.tsx'
import CalendarPage from './pages/CalendarPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage.tsx'
import FocusPage from './pages/FocusPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import './i18n'

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
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
