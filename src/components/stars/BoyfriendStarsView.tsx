'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStars } from '@/hooks/useStars'
import StarRating from './StarRating'

export default function BoyfriendStarsView() {
  const { profile } = useAuth()
  const { data, events, loading } = useStars(profile!.coupleId)
  const [showAllEvents, setShowAllEvents] = useLocalStorage('showAll_stars', false)

  if (loading || !data) {
    return <div className="text-center py-12 text-stone-400">loading stars...</div>
  }

  return (
    <div className="space-y-6">
      {/* Current Rating */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 text-center">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-6">
          Your Current Rating
        </h2>
        <StarRating rating={data.rating} size="lg" />
        <p className="text-stone-500 text-sm mt-4">
          {data.rating === 0
            ? 'no rating yet'
            : `you're at ${data.rating} out of 5 stars`}
        </p>
      </div>

      {/* Total Brownie Points */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 text-center">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Brownie Points Earned
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-6xl font-bold text-stone-600">{data.totalStars}</span>
          <span className="text-5xl">🍪</span>
        </div>
        <p className="text-stone-400 text-sm mt-3">get your bread up</p>
      </div>

      {/* Brownie Points Revoked */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 text-center">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Brownie Points Revoked
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-6xl font-bold text-stone-600">{data.revokedStars ?? 0}</span>
          <span className="text-5xl">❌</span>
        </div>
        <p className="text-stone-400 text-sm mt-3">
          {(data.revokedStars ?? 0) === 0 ? "okay you're doing good" : 'smh do better. minimize revokes'}
        </p>
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
                ? `jen rated you ${e.delta} star${e.delta === 1 ? '' : 's'}`
                : isRevoke
                ? 'jen revoked a brownie point'
                : 'jen gave you a brownie point'
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
