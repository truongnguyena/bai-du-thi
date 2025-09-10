# ChibiStudy — Student Time Management

Cute, pink-themed time management web app for Vietnamese students. Features tasks Inbox, Calendar, and Analytics with offline-first Dexie DB, virtualized lists, and basic timer.

## Stack
- React + Vite + TypeScript
- Tailwind CSS (v4) + PostCSS
- Routing: React Router
- State: Zustand
- Local persistence: IndexedDB via Dexie
- Calendar: FullCalendar
- Charts: Recharts
- Virtualized list: react-window (v2 List API)

## Run locally
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Features (mapping to assignment requirements)
- CRUD Operations: create/update/delete tasks in Inbox (`src/store/tasks.ts`, `src/pages/InboxPage.tsx`)
- Persistent storage: Dexie IndexedDB (`src/db/dexie.ts`)
- 3 Views of same data:
  - Inbox (`src/pages/InboxPage.tsx`)
  - Calendar (`src/pages/CalendarPage.tsx`)
  - Analytics (`src/pages/AnalyticsPage.tsx`)
- Time handling: `dueDate`, `estimatedMinutes`, `actualMinutes`, timer (`src/store/timer.ts`)
- 20+ items: virtualized `List` and seed button for 100 tasks

## Project structure
```text
src/
  pages/
    InboxPage.tsx
    CalendarPage.tsx
    AnalyticsPage.tsx
  store/
    tasks.ts
    timer.ts
  db/
    dexie.ts
  types/
    task.ts
  api/
    sync.ts (stub)
```

## Deployment
Deploy on Vercel/Netlify. Build command: `npm run build`.

## Notes
- AI integration endpoints can be added via serverless functions (e.g., `/api/ai`).
- Supabase/Firebase sync can extend `src/api/sync.ts`.
