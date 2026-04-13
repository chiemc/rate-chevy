'use client'

import { useAuth } from '@/contexts/AuthContext'
import GirlfriendTrafficView from '@/components/traffic/GirlfriendTrafficView'
import BoyfriendTrafficView from '@/components/traffic/BoyfriendTrafficView'

export default function TrafficPage() {
  const { profile } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">
        {profile?.role === 'girlfriend' ? '🚦 good boy or bad boy' : '🚦 good boy or bad boy'}
      </h1>
      {profile?.role === 'girlfriend' ? (
        <GirlfriendTrafficView />
      ) : (
        <BoyfriendTrafficView />
      )}
    </div>
  )
}
