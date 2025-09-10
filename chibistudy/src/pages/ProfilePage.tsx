import { usePrefsStore } from '../store/prefs'

export default function ProfilePage() {
  const {
    shameMode, accentLevel, amiOpenByDefault, setShameMode, setAccentLevel, setAmiOpen,
    userName, setUserName, avatarUrl, setAvatarUrl, defaultFocusMinutes, setDefaultFocusMinutes,
    autoPauseMusic, setAutoPauseMusic,
  } = usePrefsStore()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-pink-700">Hồ sơ cá nhân</h1>
      <div className="rounded-lg border border-pink-200 bg-white p-4">
        <div className="mb-2 text-sm font-medium text-pink-700">Thông tin</div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="w-40">Tên hiển thị</span>
            <input value={userName ?? ''} onChange={(e) => setUserName(e.target.value)} className="flex-1 rounded-md border border-pink-200 px-3 py-2 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="w-40">Avatar URL</span>
            <input value={avatarUrl ?? ''} onChange={(e) => setAvatarUrl(e.target.value)} className="flex-1 rounded-md border border-pink-200 px-3 py-2 text-sm" />
          </label>
        </div>
      </div>
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
      <div className="rounded-lg border border-pink-200 bg-white p-4">
        <div className="mb-2 text-sm font-medium text-pink-700">Focus</div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="w-40">Thời lượng mặc định (phút)</span>
            <input type="number" min={1} value={defaultFocusMinutes} onChange={(e) => setDefaultFocusMinutes(Number(e.target.value))} className="w-40 rounded-md border border-pink-200 px-3 py-2 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-pink-500" checked={autoPauseMusic} onChange={(e) => setAutoPauseMusic(e.target.checked)} />
            Tự tạm dừng nhạc khi bắt đầu Focus
          </label>
        </div>
      </div>
    </div>
  )
}

