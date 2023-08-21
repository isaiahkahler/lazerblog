import { create } from 'zustand'
import { createJSONStorage, devtools, persist, StateStorage } from 'zustand/middleware'
// import { User } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';



interface GameState {
  participants: string[],
  expiration: number,
  queue: string[],
  exitQueue: string[],
  owner: string
}

interface GlobalState {
  session: Session | null
  setSession: (session: Session | null) => void,
  test: number | null,
  setTest: (input: number | null) => void,
  user: User | null,
  setUser: (user: User | null) => void,
  // classCode: string | null,
  // setClassCode: (code: string) => void,
  // user: User | null
  // setUser: (user: User | null) => void,
  // passcode: string | null,
  // setPasscode: (passcode: string | null) => void
}

export const useStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        session: null,
        setSession: (_session) => set((state) => ({session: _session})),
        test: null,
        setTest: (_input) => set((state) => ({test: _input})),
        user: null,
        setUser: (_user) => set((state) => ({user: _user})),
        // classCode: null,
        // setClassCode: (code) => set((state) => ({ classCode: code })),
        // user: null,
        // setUser: (_user) => set((state) => ({user: _user})),
        // passcode: null,
        // setPasscode: (_passcode) => set((state) => ({passcode: _passcode})),
      }),
      {
        name: 'session-storage',
        storage: createJSONStorage(() => AsyncStorage)
      }
    )
  )
)
