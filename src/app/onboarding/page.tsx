'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import CreateCoupleForm from '@/components/auth/CreateCoupleForm'
import JoinCoupleForm from '@/components/auth/JoinCoupleForm'

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'choose' | 'create' | 'join'>('choose')

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (profile?.coupleId) {
      router.replace('/home/stars')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-orange-50">
        <div className="text-4xl animate-pulse">⭐</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-orange-50 px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {step === 'choose' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👩🏻‍❤️‍👨🏻</div>
              <h1 className="text-2xl font-bold text-stone-800">welcome!</h1>
              <p className="text-stone-500 mt-2 text-sm">
                are you jen or chevy?
              </p>
            </div>

            <button
              onClick={() => setStep('create')}
              className="w-full p-5 rounded-3xl bg-white border-2 border-orange-100 hover:border-stone-400 active:bg-stone-50 transition-all text-left shadow-sm"
            >
              <div className="text-2xl mb-2">👑</div>
              <div className="font-semibold text-stone-800">i'm jen</div>
              <div className="text-sm text-stone-500 mt-1">
                i'll be the one doing the evaluating
              </div>
            </button>

            <button
              onClick={() => setStep('join')}
              className="w-full p-5 rounded-3xl bg-white border-2 border-orange-100 hover:border-stone-400 active:bg-stone-50 transition-all text-left shadow-sm"
            >
              <div className="text-2xl mb-2">💌</div>
              <div className="font-semibold text-stone-800">i'm chevy</div>
              <div className="text-sm text-stone-500 mt-1">
                i'll be the one being evaluated
              </div>
            </button>
          </div>
        )}

        {step !== 'choose' && (
          <div>
            <button
              onClick={() => setStep('choose')}
              className="flex items-center gap-2 text-stone-500 text-sm mb-6 hover:text-stone-700"
            >
              ← back
            </button>
            <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6">
              {step === 'create' ? <CreateCoupleForm /> : <JoinCoupleForm />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
