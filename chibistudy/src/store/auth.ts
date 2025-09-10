import { create } from 'zustand'
import { supabase } from '../lib/supabase'

type AuthUser = {
  id: string
  email?: string
  avatarUrl?: string
  name?: string
} | null

type AuthState = {
  user: AuthUser
  loading: boolean
  init: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  init: async () => {
    if (!supabase) return
    set({ loading: true })
    const { data: { session } } = await supabase.auth.getSession()
    const sessUser = session?.user
    set({
      user: sessUser ? {
        id: sessUser.id,
        email: sessUser.email ?? undefined,
        avatarUrl: (sessUser.user_metadata as any)?.avatar_url,
        name: (sessUser.user_metadata as any)?.name,
      } : null,
      loading: false,
    })
    supabase.auth.onAuthStateChange((_event, newSession) => {
      const u = newSession?.user
      set({
        user: u ? {
          id: u.id,
          email: u.email ?? undefined,
          avatarUrl: (u.user_metadata as any)?.avatar_url,
          name: (u.user_metadata as any)?.name,
        } : null,
      })
    })
  },
  signInWithGoogle: async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  },
  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  },
}))

