import { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Database } from '@/types/database'

export type UserData = Database['public']['Tables']['users']['Row'];

interface GlobalState {
  session: Session | null,
  setSession: (session: Session | null) => void,
  user: UserData | null
  setUser: (user: UserData | null) => void,
}

export const useStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        session: null,
        setSession: (_session) => set((state) => ({session: _session})),
        user: null,
        setUser: (_user) => set((state) => ({user: _user})),
      }),
      {
        name: 'session-storage',
      }
    )
  )
)