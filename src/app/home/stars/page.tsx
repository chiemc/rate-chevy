'use client'

import { useAuth } from '@/contexts/AuthContext'
import GirlfriendStarsView from '@/components/stars/GirlfriendStarsView'
import BoyfriendStarsView from '@/components/stars/BoyfriendStarsView'

export default function StarsPage() {
  const { profile } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">
        {profile?.role === 'girlfriend' ? 'rate chevy ⭐' : '⭐ your progress'}
      </h1>
      {profile?.role === 'girlfriend' ? (
        <GirlfriendStarsView />
      ) : (
        <BoyfriendStarsView />
      )}
    </div>
  )
}
