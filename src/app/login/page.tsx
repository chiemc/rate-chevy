'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (user && profile?.coupleId) {
      router.replace('/home/stars')
    } else if (user && !profile?.coupleId) {
      router.replace('/onboarding')
    }
  }, [user, profile, loading, router])

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-orange-50 px-6 py-12">
      <LoginForm />
    </div>
  )
}
