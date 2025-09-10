import { useMusicStore } from '../store/music'
import AnimeLoader from './AnimeLoader'
import { useRef, useEffect } from 'react'

export default function MusicPlayer() {
  const { query, setQuery, resolveAndPlay, videoId, playing, stop, loading, source, setSource, audioUrl, setFile } = useMusicStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (playing && audioUrl) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [playing, audioUrl])

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[340px] rounded-xl border border-pink-300 bg-white/90 p-3 backdrop-blur shadow">
      <div className="mb-2 text-sm font-medium text-pink-700">Ami Music</div>
      <div className="mb-2 flex items-center gap-2">
        <select value={source} onChange={(e) => setSource(e.target.value as any)} className="rounded-md border border-pink-200 px-2 py-1 text-sm">
          <option value="youtube">YouTube</option>
          <option value="audio">Audio URL</option>
          <option value="file">Tệp</option>
        </select>
        {source === 'file' ? (
          <input type="file" accept="audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} className="text-sm" />
        ) : (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={source === 'youtube' ? 'Link YouTube hoặc Video ID' : 'Audio URL'}
            className="flex-1 rounded-md border border-pink-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-300"
          />
        )}
        {source !== 'file' && (
          <button onClick={resolveAndPlay} className="rounded-md bg-pink-500 px-3 py-1 text-sm text-white hover:bg-pink-600">Phát</button>
        )}
        {playing && (
          <button onClick={stop} className="rounded-md border border-pink-300 px-3 py-1 text-sm hover:bg-pink-50">Dừng</button>
        )}
      </div>
      {loading ? (
        <AnimeLoader />
      ) : playing ? (
        source === 'youtube' && videoId ? (
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
        ) : source !== 'youtube' && audioUrl ? (
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
        ) : null
      ) : null}
    </div>
  )
}

