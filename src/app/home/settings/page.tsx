'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [coupleCode, setCoupleCode] = useState<string | null>(null)
  const [loadingCode, setLoadingCode] = useState(false)
  const [confirmSignOut, setConfirmSignOut] = useState(false)

  async function showCoupleCode() {
    if (!profile?.coupleId) return
    setLoadingCode(true)
    const snap = await getDoc(doc(db, 'couples', profile.coupleId))
    if (snap.exists()) {
      setCoupleCode(snap.data().coupleCode)
    }
    setLoadingCode(false)
  }

  async function handleSignOut() {
    await signOut(auth)
    router.replace('/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">⚙️ settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Profile
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-stone-600 text-sm">name</span>
            <span className="font-medium text-stone-800">{profile?.displayName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-600 text-sm">role</span>
            <span className={`font-medium ${profile?.role === 'girlfriend' ? 'text-rose-500' : 'text-blue-500'}`}>
              {profile?.role === 'girlfriend' ? '👑 girlfriend' : '💌 boyfriend'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-600 text-sm">email</span>
            <span className="font-medium text-stone-800 text-sm">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Couple Code — only visible to Jen */}
      {profile?.role === 'girlfriend' && <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Couple Code
        </h2>
        {coupleCode ? (
          <div className="text-center">
            <p className="text-stone-500 text-sm mb-2">share this with chevy:</p>
            <p className="text-3xl font-bold tracking-widest text-pink-500 bg-pink-50 py-3 rounded-2xl">
              {coupleCode}
            </p>
            <button
              onClick={() => navigator.share?.({ title: 'ratingchevy.com', text: `ratingchevy.com use code ${coupleCode} so i can monitor your behavior boy` })}
              className="mt-3 text-pink-500 text-sm font-medium"
            >
              Share →
            </button>
          </div>
        ) : (
          <button
            onClick={showCoupleCode}
            disabled={loadingCode}
            className="w-full py-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 font-medium text-sm transition-colors hover:bg-pink-100 disabled:opacity-60"
          >
            {loadingCode ? 'loading...' : 'show couple code'}
          </button>
        )}
      </div>}

      {/* About */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          About
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          rate chevy — made with love for you to provide feedback on me so i can improve!
        </p>
      </div>

      {/* sign out */}
      <button
        onClick={() => setConfirmSignOut(true)}
        className="w-full py-3 rounded-2xl border-2 border-rose-200 text-rose-500 font-semibold hover:bg-rose-50 transition-colors"
      >
        sign out
      </button>

      {/* sign out Confirmation */}
      {confirmSignOut && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800 text-center">sign out?</h3>
            <p className="text-stone-500 text-sm text-center">
              you can sign back in anytime.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-2xl bg-rose-500 text-white font-semibold"
            >
              sign out
            </button>
            <button
              onClick={() => setConfirmSignOut(false)}
              className="w-full py-3 rounded-2xl bg-stone-100 text-stone-700 font-semibold"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
