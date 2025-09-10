# ChibiStudy — Student Time Manager (VN)

> Ứng dụng web giúp sinh viên VN quản lý nhiệm vụ + lịch + phân tích năng suất. Giao diện hồng/chibi, hỗ trợ song ngữ (vi/en), có timer, Calendar và Analytics, lưu cục bộ (IndexedDB) và đồng bộ Supabase.

- Demo: (điền link Vercel sau khi deploy)
- Repo: (link GitHub của bạn)

---

## Tính năng chính (map với yêu cầu bài thi)
- CRUD đầy đủ trên dữ liệu Task
  - Tạo, đọc, cập nhật trạng thái/due/ước lượng, xoá
  - Code: `src/pages/InboxPage.tsx`, `src/store/tasks.ts`, `src/components/TaskCard.tsx`
- Lưu trữ liên tục
  - Cục bộ: IndexedDB (Dexie) `src/db/dexie.ts`
  - Đồng bộ từ xa (tùy chọn): Supabase `src/api/sync.ts`, `src/lib/supabase.ts`
- Ít nhất 3 view cho cùng dữ liệu
  - Inbox/List: `src/pages/InboxPage.tsx`
  - Calendar: kéo/thả thay đổi `dueDate` — `src/pages/CalendarPage.tsx`, `src/components/CalendarWrapper.tsx`
  - Analytics: thống kê, biểu đồ — `src/pages/AnalyticsPage.tsx`
- Xử lý thời gian/ngày
  - Trường `dueDate`, `estimatedMinutes`, `actualMinutes` (timer)
  - Overdue UI + % vượt ước lượng — trong `TaskCard`
  - dayjs timezone-ready
- Hỗ trợ 20+ items
  - Virtualized list bằng `react-virtuoso` — `src/components/TaskListVirtualized.tsx`
  - Đã thử với 100+ nhiệm vụ mượt
- Song ngữ
  - i18next + react-i18next — `src/i18n.ts`, switcher trên header
- Calendar kéo-thả
  - FullCalendar, cập nhật `dueDate` qua drag-drop
- Analytics
  - Recharts: tổng quan ước lượng/thực tế, số task tạo theo ngày (14 ngày)

---

## Kiến trúc & thư viện
- React + Vite + TypeScript
- UI: Tailwind CSS (v4)
- State: Zustand (`tasks`, `timer`)
- Local DB: Dexie (IndexedDB)
- Calendar: FullCalendar
- Charts: Recharts
- i18n: i18next
- Đồng bộ: Supabase (Postgres + JS client)

Cấu trúc chính:
```
src/
  pages/ (Inbox, Calendar, Analytics, Focus, Settings)
  components/ (TaskCard, TaskListVirtualized, CalendarWrapper, GlobalTimerBar)
  store/ (tasks, timer)
  db/ (dexie)
  api/ (sync)
  lib/ (supabase, kurumi)
  types/ (task)
```

---

## Cách chạy local
Yêu cầu: Node.js 20+, npm 10+

```bash
npm install
npm run dev
# mở http://localhost:5173
```

Biến môi trường (tùy chọn nếu dùng Supabase): tạo `.env` ở root
```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
Xem mẫu: `.env.example`

---

## Supabase (đồng bộ tuỳ chọn)
1) Tạo project Supabase, lấy `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (Role: anon)
2) Tạo bảng `tasks` (SQL mẫu, có thể điều chỉnh kiểu):
```sql
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text,
  createdAt timestamptz not null,
  updatedAt timestamptz,
  dueDate timestamptz,
  estimatedMinutes int,
  actualMinutes int,
  priority text,
  tags jsonb default '[]'::jsonb,
  status text,
  recurrence jsonb,
  projectId text,
  createdBy text,
  procrastinationScore float8,
  autoScheduledAt timestamptz
);
```
3) Trong app: nút “Đồng bộ ngay” ở `Settings`

Sync strategy: last-write-wins theo `updatedAt` (xem `src/api/sync.ts`).

---

## Deploy lên Vercel
- Import repo → Chọn preset Vite (hoặc Other)
- Root Directory: thư mục chứa `package.json` (ví dụ `./` hoặc `chibistudy`)
- Install: `npm install`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- SPA routing: file `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Mỗi lần push → auto build & deploy. Nếu lỗi ENOENT package.json → chỉnh lại Root Directory đúng thư mục app.

---

## Checklist nộp bài
- [x] CRUD tasks (`src/pages/InboxPage.tsx`, `src/store/tasks.ts`)
- [x] Persistence: Dexie + Supabase sync (`src/api/sync.ts`)
- [x] 3 Views: Inbox / Calendar / Analytics
- [x] Time handling: dueDate, estimatedMinutes, actualMinutes (+ timer, overdue)
- [x] Handles 20+ items (virtualized)
- [x] i18n: vi/en
- [ ] Demo: https://your-vercel-deploy-url

---

## License
MIT

## Liên hệ
- Tác giả: (điền tên)
- Email: (điền email)