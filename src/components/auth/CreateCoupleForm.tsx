'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createCouple } from '@/lib/coupleCode'

export default function CreateCoupleForm() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [coupleCode, setCoupleCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!user || !displayName.trim()) return
    setError('')
    setLoading(true)
    try {
      await createCouple(user.uid, displayName.trim())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">👑</div>
        <h2 className="text-xl font-bold text-stone-800">begin your evaluation</h2>
        <p className="text-stone-500 text-sm mt-1">
          you have privileges chevy doesn't. enjoy!
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          your name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. queen mama"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800"
        />
      </div>

      {coupleCode && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-stone-600 mb-1">share this code with chevy:</p>
          <p className="text-3xl font-bold tracking-widest text-stone-700">{coupleCode}</p>
          <p className="text-xs text-stone-500 mt-2">he enters it on his phone to join</p>
        </div>
      )}

      {error && (
        <p className="text-rose-500 text-sm bg-rose-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        onClick={handleCreate}
        disabled={loading || !displayName.trim()}
        className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
      >
        {loading ? 'beginning...' : 'begin'}
      </button>
    </div>
  )
}
