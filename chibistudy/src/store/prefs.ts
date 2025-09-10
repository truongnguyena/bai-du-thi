import { create } from 'zustand'

type AccentLevel = 'soft' | 'vivid'

type PrefsState = {
  shameMode: boolean
  accentLevel: AccentLevel
  amiOpenByDefault: boolean
  userName?: string
  avatarUrl?: string
  defaultFocusMinutes: number
  autoPauseMusic: boolean
  setShameMode: (v: boolean) => void
  setAccentLevel: (v: AccentLevel) => void
  setAmiOpen: (v: boolean) => void
  setUserName: (v: string) => void
  setAvatarUrl: (v: string) => void
  setDefaultFocusMinutes: (v: number) => void
  setAutoPauseMusic: (v: boolean) => void
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
  const { shameMode, accentLevel, amiOpenByDefault, userName, avatarUrl, defaultFocusMinutes, autoPauseMusic } = state
  localStorage.setItem(KEY, JSON.stringify({ shameMode, accentLevel, amiOpenByDefault, userName, avatarUrl, defaultFocusMinutes, autoPauseMusic }))
}

const initial = load() ?? { shameMode: false, accentLevel: 'soft', amiOpenByDefault: true, userName: '', avatarUrl: '', defaultFocusMinutes: 25, autoPauseMusic: true }

export const usePrefsStore = create<PrefsState>((set, get) => ({
  shameMode: initial.shameMode,
  accentLevel: initial.accentLevel,
  amiOpenByDefault: initial.amiOpenByDefault,
  userName: initial.userName,
  avatarUrl: initial.avatarUrl,
  defaultFocusMinutes: initial.defaultFocusMinutes,
  autoPauseMusic: initial.autoPauseMusic,
  setShameMode: (v) => { set({ shameMode: v }); persist(get()) },
  setAccentLevel: (v) => { set({ accentLevel: v }); persist(get()) },
  setAmiOpen: (v) => { set({ amiOpenByDefault: v }); persist(get()) },
  setUserName: (v) => { set({ userName: v }); persist(get()) },
  setAvatarUrl: (v) => { set({ avatarUrl: v }); persist(get()) },
  setDefaultFocusMinutes: (v) => { set({ defaultFocusMinutes: Math.max(1, Math.floor(v)) }); persist(get()) },
  setAutoPauseMusic: (v) => { set({ autoPauseMusic: v }); persist(get()) },
}))

