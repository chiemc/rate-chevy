'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import BottomNav from '@/components/ui/BottomNav'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else if (!profile?.coupleId) {
      router.replace('/onboarding')
    }
  }, [user, profile, loading, router])

  if (loading || !user || !profile?.coupleId) {
    return (
      <div className="flex h-full items-center justify-center bg-orange-50">
        <div className="text-4xl animate-pulse">⭐</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-orange-50">
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
