'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserProfile } from '@/types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubProfile: (() => void) | null = null

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(true)

      if (unsubProfile) {
        unsubProfile()
        unsubProfile = null
      }

      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      unsubProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
        setProfile(snap.exists() ? ({ uid: firebaseUser.uid, ...snap.data() } as UserProfile) : null)
        setLoading(false)
      })
    })

    return () => {
      unsubAuth()
      if (unsubProfile) unsubProfile()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
