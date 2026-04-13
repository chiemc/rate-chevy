'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStars } from '@/hooks/useStars'
import StarRating from './StarRating'

export default function GirlfriendStarsView() {
  const { profile } = useAuth()
  const { data, events, loading, setRating, awardStar, revokeStar } = useStars(profile!.coupleId)
  const [ratingNote, setRatingNote] = useState('')
  const [awardNote, setAwardNote] = useState('')
  const [revokeNote, setRevokeNote] = useState('')
  const [awarding, setAwarding] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [pendingRating, setPendingRating] = useState<number | null>(null)
  const [settingRating, setSettingRating] = useState(false)
  const [showAllEvents, setShowAllEvents] = useLocalStorage('showAll_stars', false)

  if (loading || !data) {
    return <div className="text-center py-12 text-stone-400">loading stars...</div>
  }

  const displayRating = pendingRating !== null ? pendingRating : data.rating

  function handleStarSelect(r: number) {
    // Toggle off if tapping the same star as the pending selection
    setPendingRating(displayRating === r ? 0 : r)
  }

  async function handleConfirmRating() {
    if (pendingRating === null) return
    setSettingRating(true)
    await setRating(pendingRating, ratingNote.trim() || null)
    setRatingNote('')
    setPendingRating(null)
    setSettingRating(false)
  }

  async function handleAward() {
    setAwarding(true)
    await awardStar(awardNote.trim() || null)
    setAwardNote('')
    setAwarding(false)
  }

  async function handleRevoke() {
    setRevoking(true)
    await revokeStar(revokeNote.trim() || null)
    setRevokeNote('')
    setRevoking(false)
  }

  return (
    <div className="space-y-6">
      {/* Current Rating */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Current Rating
        </h2>
        <div className="flex flex-col items-center gap-4">
          <StarRating
            rating={displayRating}
            editable
            size="lg"
            onChange={handleStarSelect}
          />
          <p className="text-stone-400 text-sm">
            {displayRating === 0
              ? 'tap a star to set the rating'
              : `${displayRating} out of 5 — tap same star to clear`}
          </p>
          <input
            type="text"
            value={ratingNote}
            onChange={(e) => setRatingNote(e.target.value)}
            placeholder="reason for this rating (optional)"
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800 text-sm"
          />
          <button
            onClick={handleConfirmRating}
            disabled={pendingRating === null || settingRating}
            className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-40"
          >
            {settingRating ? 'Setting...' : 'Set Ranking'}
          </button>
        </div>
      </div>

      {/* Award Stars */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500  uppercase tracking-wide mb-4">
          award a brownie point
        </h2>
        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-stone-600">{data.totalStars}</span>
          <p className="text-stone-400 text-sm mt-1">total brownie points earned</p>
        </div>
        <input
          type="text"
          value={awardNote}
          onChange={(e) => setAwardNote(e.target.value)}
          placeholder="add a reason (optional)"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800 text-sm mb-3"
        />
        <button
          onClick={handleAward}
          disabled={awarding}
          className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {awarding ? '✨ Awarding...' : '🍪 award a brownie point'}
        </button>
      </div>

      {/* Revoke Brownie Point */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          revoke a brownie point
        </h2>
        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-stone-600">{data.revokedStars ?? 0}</span>
          <p className="text-stone-400 text-sm mt-1">brownie points revoked</p>
        </div>
        <input
          type="text"
          value={revokeNote}
          onChange={(e) => setRevokeNote(e.target.value)}
          placeholder="add a reason (optional)"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800 text-sm mb-3"
        />
        <button
          onClick={handleRevoke}
          disabled={revoking || data.totalStars === 0}
          className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {revoking ? '❌ Revoking...' : '❌ revoke a brownie point'}
        </button>
      </div>

      {/* Recent Activity */}
      {events.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {(showAllEvents ? events : events.slice(0, 5)).map((e) => {
              const isRating = e.type ? e.type === 'rating' : e.delta > 1
              const isRevoke = e.type === 'revoke'
              const emoji = isRating ? '⭐' : isRevoke ? '❌' : '🍪'
              const label = isRating
                ? `rated chevy ${e.delta} star${e.delta === 1 ? '' : 's'}`
                : isRevoke
                ? 'revoked a brownie point'
                : 'awarded chevy a brownie point'
              return (
              <div key={e.id} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-700 text-sm font-medium">{label}</p>
                  {e.note && <p className="text-stone-500 text-xs italic">"{e.note}"</p>}
                  <p className="text-stone-400 text-xs mt-0.5">
                    {e.createdAt.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              )
            })}
          </div>
          {events.length > 5 && !showAllEvents && (
            <button
              onClick={() => setShowAllEvents(true)}
              className="mt-4 w-full py-2 rounded-2xl border border-orange-100 text-stone-500 text-sm hover:bg-orange-50 transition-colors"
            >
              show all ({events.length})
            </button>
          )}
          {showAllEvents && (
            <button
              onClick={() => setShowAllEvents(false)}
              className="mt-4 w-full py-2 rounded-2xl border border-orange-100 text-stone-500 text-sm hover:bg-orange-50 transition-colors"
            >
              show less
            </button>
          )}
        </div>
      )}
    </div>
  )
}
