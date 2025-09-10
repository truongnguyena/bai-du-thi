import { create } from 'zustand'

type Source = 'youtube' | 'audio' | 'file'

type MusicState = {
  query: string
  source: Source
  videoId?: string
  audioUrl?: string
  playing: boolean
  loading: boolean
  visible: boolean
  setQuery: (q: string) => void
  setSource: (s: Source) => void
  setFile: (file: File) => void
  resolveAndPlay: () => Promise<void>
  stop: () => void
  setVisible: (v: boolean) => void
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

// search by query is removed to avoid external API dependency

export const useMusicStore = create<MusicState>((set, get) => ({
  query: '',
  source: 'youtube',
  videoId: undefined,
  audioUrl: undefined,
  playing: false,
  loading: false,
  visible: false,
  setQuery: (q) => set({ query: q }),
  setSource: (s) => set({ source: s }),
  setFile: (file) => {
    const url = URL.createObjectURL(file)
    set({ audioUrl: url, videoId: undefined, source: 'file', playing: true, visible: true })
  },
  resolveAndPlay: async () => {
    const { source } = get()
    const q = get().query.trim()
    if (source === 'youtube') {
      if (!q) return
      set({ loading: true })
      const vid = parseVideoId(q)
      if (vid) {
        set({ videoId: vid, audioUrl: undefined, playing: true, loading: false, visible: true })
      } else {
        set({ loading: false })
        alert('Dán link YouTube hợp lệ (hoặc mã video 11 ký tự).')
      }
      return
    }
    if (source === 'audio') {
      if (!q) return
      try {
        // kiểm tra URL hợp lệ
        const u = new URL(q)
        set({ audioUrl: u.toString(), videoId: undefined, playing: true, visible: true })
      } catch {
        alert('Nhập URL audio hợp lệ (mp3, m4a, ogg, v.v.).')
      }
      return
    }
  },
  stop: () => set({ playing: false }),
  setVisible: (v) => set({ visible: v }),
}))

