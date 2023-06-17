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
  errors: any[],
  setErrors: (errors: any[]) => void,
  addError: (error: any) => void,
  removeErrorAtIndex: (index: number) => void
}

// export const useStore = create<GlobalState>()(
//   devtools(
//     persist(
//       (set) => ({
//         session: null,
//         setSession: (_session) => set((state) => ({session: _session})),
//         user: null,
//         setUser: (_user) => set((state) => ({user: _user})),
//         errors: [],
//         setErrors: (_errors) => set((state) => ({errors: _errors})),
//         addError: (_error) => set((state) => ({errors: [...state.errors, _error]})),
//       }),
//       {
//         name: 'session-storage',
//       }
//     )
//   )
// )
export const useStore = create<GlobalState>()(
  (set) => ({
    session: null,
    setSession: (_session) => set((state) => ({ session: _session })),
    user: null,
    setUser: (_user) => set((state) => ({ user: _user })),
    errors: [],
    setErrors: (_errors) => set((state) => ({ errors: _errors })),
    addError: (_error) => set((state) => ({ errors: [...state.errors, _error] })),
    removeErrorAtIndex: (index) => set((state) =>{
      const oldErrors = [...state.errors];
      oldErrors.splice(index, 1)
      return {errors: oldErrors};
    })
  })
)