'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTrafficLight } from '@/hooks/useTrafficLight'
import TrafficLight from './TrafficLight'

const statusMessages: Record<string, string> = {
  red: "you're cooked buddy, fix it immediately",
  yellow: "you're on thin ice, be very careful",
  green: "good boyyyy",
}

export default function BoyfriendTrafficView() {
  const { profile } = useAuth()
  const { data, events, loading } = useTrafficLight(profile!.coupleId)
  const [showAllEvents, setShowAllEvents] = useLocalStorage('showAll_traffic', false)

  if (loading || !data) {
    return <div className="text-center py-12 text-stone-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Live status */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 text-center">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-6">
          Your Status Right Now
        </h2>
        <TrafficLight status={data.status} size="lg" />
        <p className="mt-5 font-semibold text-stone-700 text-lg">
          {statusMessages[data.status]}
        </p>
        {data.reason && (
          <p className="text-stone-500 text-sm mt-2 italic bg-stone-50 rounded-2xl px-4 py-3 mx-4">
            "{data.reason}"
          </p>
        )}
        <p className="text-stone-400 text-xs mt-4">
          last updated{' '}
          {data.updatedAt.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Recent Activity */}
      {events.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {(showAllEvents ? events : events.slice(0, 5)).map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">
                  {e.status === 'red' ? '🔴' : e.status === 'yellow' ? '🟡' : '🟢'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-700 text-sm capitalize font-medium">{e.status}</p>
                  {e.reason && <p className="text-stone-500 text-xs italic">"{e.reason}"</p>}
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
            ))}
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
