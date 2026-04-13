'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

// AuthProvider uses Firebase which must never run on the server
const AuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then((m) => ({ default: m.AuthProvider })),
  { ssr: false, loading: () => null }
)

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
