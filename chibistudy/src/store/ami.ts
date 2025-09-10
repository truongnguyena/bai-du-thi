import { create } from 'zustand'

type AmiState = {
  cue?: string
  timestamp?: number
  notify: (msg: string) => void
  clear: () => void
}

export const useAmiStore = create<AmiState>((set) => ({
  cue: undefined,
  timestamp: undefined,
  notify: (msg) => set({ cue: msg, timestamp: Date.now() }),
  clear: () => set({ cue: undefined }),
}))

