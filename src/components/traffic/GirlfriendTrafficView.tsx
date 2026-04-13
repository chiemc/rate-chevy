'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTrafficLight } from '@/hooks/useTrafficLight'
import TrafficLight from './TrafficLight'
import type { TrafficStatus } from '@/types'

const options: { status: TrafficStatus; label: string; bg: string; border: string; text: string }[] = [
  {
    status: 'red',
    label: '🔴 red',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
  },
  {
    status: 'yellow',
    label: '🟡 yellow',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
  },
  {
    status: 'green',
    label: '🟢 green',
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-700',
  },
]

export default function GirlfriendTrafficView() {
  const { profile } = useAuth()
  const { data, events, loading, setStatus } = useTrafficLight(profile!.coupleId)
  const [selected, setSelected] = useState<TrafficStatus | null>(null)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAllEvents, setShowAllEvents] = useLocalStorage('showAll_traffic', false)

  if (loading || !data) {
    return <div className="text-center py-12 text-stone-400">loading...</div>
  }

  async function handleSet() {
    if (!selected) return
    setSaving(true)
    await setStatus(selected, reason.trim() || null)
    setSelected(null)
    setReason('')
    setSaving(false)
  }

  const labels: Record<TrafficStatus, string> = {
    red: "🔴 red — he's being a bad boy/pos",
    yellow: "🟡 yellow — he's on thin ice",
    green: "🟢 green — he's being a good little boy",
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 text-center">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-6">
          Current Status
        </h2>
        <TrafficLight status={data.status} size="lg" />
        <p className="mt-4 font-semibold text-stone-700">{labels[data.status]}</p>
        {data.reason && (
          <p className="text-stone-500 text-sm mt-1 italic">"{data.reason}"</p>
        )}
      </div>

      {/* Set New Status */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
          Change the Light
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {options.map((opt) => (
            <button
              key={opt.status}
              onClick={() => setSelected(opt.status)}
              className={`py-3 rounded-2xl border-2 font-medium text-sm transition-all ${
                selected === opt.status
                  ? `${opt.bg} ${opt.border} ${opt.text} scale-105 shadow-sm`
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="add a reason (optional)"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-stone-50 text-stone-800 text-sm mb-3"
        />
        <button
          onClick={handleSet}
          disabled={!selected || saving}
          className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? 'setting...' : 'set status'}
        </button>
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
                  <p className="text-stone-700 text-sm font-medium">{e.status}</p>
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
