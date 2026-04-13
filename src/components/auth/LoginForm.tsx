'use client'

import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="text-3xl font-bold text-stone-800">rate chevy</h1>
        <p className="text-stone-500 mt-2">for my love, jen</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6">
        <div className="flex rounded-2xl bg-orange-50 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'signin'
                ? 'bg-stone-600 shadow-sm text-white'
                : 'text-stone-500'
            }`}
          >
            sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'bg-stone-600 shadow-sm text-white'
                : 'text-stone-500'
            }`}
          >
            sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-rose-500 text-sm bg-rose-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? '...' : mode === 'signin' ? 'sign in' : 'create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
