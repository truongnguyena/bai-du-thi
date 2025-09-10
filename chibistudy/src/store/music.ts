import { create } from 'zustand'

type MusicState = {
  query: string
  videoId?: string
  playing: boolean
  loading: boolean
  setQuery: (q: string) => void
  resolveAndPlay: () => Promise<void>
  stop: () => void
}

function parseVideoId(input: string): string | undefined {
  try {
    if (/youtu\.be\//.test(input)) {
      const m = input.match(/youtu\.be\/([\w-]{6,})/)
      return m?.[1]
    }
    if (/youtube\.com\//.test(input)) {
      const u = new URL(input)
      const v = u.searchParams.get('v')
      if (v) return v
    }
    // if looks like id
    if (/^[\w-]{11}$/.test(input)) return input
  } catch {}
  return undefined
}

async function searchVideoIdByQuery(q: string): Promise<string | undefined> {
  const key = import.meta.env.VITE_YT_API_KEY
  if (!key) return undefined
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', '1')
  url.searchParams.set('q', q)
  url.searchParams.set('key', key)
  const res = await fetch(url.toString())
  if (!res.ok) return undefined
  const data = await res.json()
  const id = data.items?.[0]?.id?.videoId
  return typeof id === 'string' ? id : undefined
}

export const useMusicStore = create<MusicState>((set, get) => ({
  query: '',
  videoId: undefined,
  playing: false,
  loading: false,
  setQuery: (q) => set({ query: q }),
  resolveAndPlay: async () => {
    const q = get().query.trim()
    if (!q) return
    set({ loading: true })
    let vid = parseVideoId(q)
    if (!vid) {
      vid = await searchVideoIdByQuery(q)
    }
    if (vid) {
      set({ videoId: vid, playing: true, loading: false })
    } else {
      set({ loading: false })
      alert('Không tìm thấy bài nhạc. Thử dán link YouTube hoặc đặt VITE_YT_API_KEY.')
    }
  },
  stop: () => set({ playing: false }),
}))

