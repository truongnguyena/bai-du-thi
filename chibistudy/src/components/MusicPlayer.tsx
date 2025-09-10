import { useMusicStore } from '../store/music'
import AnimeLoader from './AnimeLoader'

export default function MusicPlayer() {
  const { query, setQuery, resolveAndPlay, videoId, playing, stop, loading } = useMusicStore()
  return (
    <div className="fixed bottom-4 left-4 z-40 w-[320px] rounded-xl border border-pink-300 bg-white/90 p-3 backdrop-blur shadow">
      <div className="mb-2 text-sm font-medium text-pink-700">Ami Music</div>
      <div className="mb-2 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Link hoặc tên bài nhạc YouTube"
          className="flex-1 rounded-md border border-pink-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button onClick={resolveAndPlay} className="rounded-md bg-pink-500 px-3 py-1 text-sm text-white hover:bg-pink-600">Phát</button>
        {playing && (
          <button onClick={stop} className="rounded-md border border-pink-300 px-3 py-1 text-sm hover:bg-pink-50">Dừng</button>
        )}
      </div>
      {loading ? (
        <AnimeLoader />
      ) : playing && videoId ? (
        <div className="overflow-hidden rounded-lg">
          <iframe
            width="100%"
            height="180"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  )}

