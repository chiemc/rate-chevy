'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function RootPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else if (!profile?.coupleId) {
      router.replace('/onboarding')
    } else {
      router.replace('/home/stars')
    }
  }, [user, profile, loading, router])

  return (
    <div className="flex h-full items-center justify-center bg-orange-50">
      <div className="text-4xl animate-pulse">⭐</div>
    </div>
  )
}
