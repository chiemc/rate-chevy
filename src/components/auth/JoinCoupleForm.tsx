'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { joinCouple } from '@/lib/coupleCode'

export default function JoinCoupleForm() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin() {
    if (!user || !displayName.trim() || !code.trim()) return
    setError('')
    setLoading(true)
    try {
      await joinCouple(user.uid, displayName.trim(), code.trim())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">💌</div>
        <h2 className="text-xl font-bold text-stone-800">join jen</h2>
        <p className="text-stone-500 text-sm mt-1">
          enter the code jen shared with you
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          your desired name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. jester"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          couple code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="ABC123"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800 tracking-widest text-center text-xl font-bold uppercase"
        />
      </div>

      {error && (
        <p className="text-rose-500 text-sm bg-rose-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        onClick={handleJoin}
        disabled={loading || !displayName.trim() || code.length !== 6}
        className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
      >
        {loading ? 'joining...' : 'join couple'}
      </button>
    </div>
  )
}
