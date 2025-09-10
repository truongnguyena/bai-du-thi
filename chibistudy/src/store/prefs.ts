import { create } from 'zustand'

type AccentLevel = 'soft' | 'vivid'

type PrefsState = {
  shameMode: boolean
  accentLevel: AccentLevel
  amiOpenByDefault: boolean
  setShameMode: (v: boolean) => void
  setAccentLevel: (v: AccentLevel) => void
  setAmiOpen: (v: boolean) => void
}

const KEY = 'chibistudy_prefs'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persist(state: PrefsState) {
  const { shameMode, accentLevel, amiOpenByDefault } = state
  localStorage.setItem(KEY, JSON.stringify({ shameMode, accentLevel, amiOpenByDefault }))
}

const initial = load() ?? { shameMode: false, accentLevel: 'soft', amiOpenByDefault: true }

export const usePrefsStore = create<PrefsState>((set, get) => ({
  shameMode: initial.shameMode,
  accentLevel: initial.accentLevel,
  amiOpenByDefault: initial.amiOpenByDefault,
  setShameMode: (v) => { set({ shameMode: v }); persist(get()) },
  setAccentLevel: (v) => { set({ accentLevel: v }); persist(get()) },
  setAmiOpen: (v) => { set({ amiOpenByDefault: v }); persist(get()) },
}))

