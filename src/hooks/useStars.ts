'use client'

import { useEffect, useState } from 'react'
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  query,
  orderBy,
  limit,
  increment,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { StarData, StarEvent } from '@/types'

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate()
  if (val instanceof Date) return val
  return new Date()
}

export function useStars(coupleId: string) {
  const [data, setData] = useState<StarData | null>(null)
  const [events, setEvents] = useState<StarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!coupleId) return

    const unsubData = onSnapshot(
      doc(db, 'couples', coupleId, 'stars', 'current'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data()
          setData({
            rating: d.rating ?? 0,
            totalStars: d.totalStars ?? 0,
            revokedStars: d.revokedStars ?? 0,
            updatedAt: toDate(d.updatedAt),
          })
        } else {
          setData({ rating: 0, totalStars: 0, revokedStars: 0, updatedAt: new Date() })
        }
        setLoading(false)
      }
    )

    const eventsQuery = query(
      collection(db, 'couples', coupleId, 'starEvents'),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const unsubEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(
        snap.docs.map((d) => ({
          id: d.id,
          delta: d.data().delta,
          note: d.data().note ?? null,
          type: d.data().type ?? null,
          createdAt: toDate(d.data().createdAt),
        }))
      )
    })

    return () => {
      unsubData()
      unsubEvents()
    }
  }, [coupleId])

  async function setRating(rating: number, note: string | null = null) {
    await setDoc(
      doc(db, 'couples', coupleId, 'stars', 'current'),
      { rating, updatedAt: Timestamp.now() },
      { merge: true }
    )
    await addDoc(collection(db, 'couples', coupleId, 'starEvents'), {
      delta: rating,
      note,
      type: 'rating',
      createdAt: Timestamp.now(),
    })
  }

  async function awardStar(note: string | null = null) {
    const current = data?.totalStars ?? 0
    await setDoc(
      doc(db, 'couples', coupleId, 'stars', 'current'),
      { totalStars: current + 1, updatedAt: Timestamp.now() },
      { merge: true }
    )
    await addDoc(collection(db, 'couples', coupleId, 'starEvents'), {
      delta: 1,
      note,
      type: 'brownie',
      createdAt: Timestamp.now(),
    })
  }

  async function revokeStar(note: string | null = null) {
    const current = data?.totalStars ?? 0
    await setDoc(
      doc(db, 'couples', coupleId, 'stars', 'current'),
      { totalStars: Math.max(0, current - 1), revokedStars: increment(1), updatedAt: Timestamp.now() },
      { merge: true }
    )
    await addDoc(collection(db, 'couples', coupleId, 'starEvents'), {
      delta: -1,
      note,
      type: 'revoke',
      createdAt: Timestamp.now(),
    })
  }

  return { data, events, loading, setRating, awardStar, revokeStar }
}
