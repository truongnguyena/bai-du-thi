export default function AnimeLoader() {
  return (
    <div className="flex items-center justify-center gap-2 p-6">
      <div className="relative h-6 w-6">
        <span className="absolute inset-0 animate-ping rounded-full bg-pink-300 opacity-75"></span>
        <span className="absolute inset-1 rounded-full bg-pink-500"></span>
      </div>
      <div className="text-pink-600 text-sm">Đang tải... ♡</div>
    </div>
  )
}

