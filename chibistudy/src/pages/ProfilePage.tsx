import { usePrefsStore } from '../store/prefs'

export default function ProfilePage() {
  const { shameMode, accentLevel, amiOpenByDefault, setShameMode, setAccentLevel, setAmiOpen } = usePrefsStore()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-700">Hồ sơ cá nhân</h1>
      <div className="rounded-lg border border-pink-200 bg-white p-4">
        <div className="mb-2 text-sm font-medium text-pink-700">Tùy chọn giao diện</div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-pink-500" checked={shameMode} onChange={(e) => setShameMode(e.target.checked)} />
            Chế độ "xấu hổ" (tăng nhắc nhở)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="w-40">Độ đậm màu nhấn</span>
            <select className="rounded-md border border-pink-200 px-2 py-1 text-sm" value={accentLevel} onChange={(e) => setAccentLevel(e.target.value as any)}>
              <option value="soft">Mềm</option>
              <option value="vivid">Đậm</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-pink-500" checked={amiOpenByDefault} onChange={(e) => setAmiOpen(e.target.checked)} />
            Mở Ami mặc định
          </label>
        </div>
      </div>
    </div>
  )
}

