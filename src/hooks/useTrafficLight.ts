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
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { TrafficData, TrafficEvent, TrafficStatus } from '@/types'

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate()
  if (val instanceof Date) return val
  return new Date()
}

export function useTrafficLight(coupleId: string) {
  const [data, setData] = useState<TrafficData | null>(null)
  const [events, setEvents] = useState<TrafficEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!coupleId) return

    const unsubData = onSnapshot(
      doc(db, 'couples', coupleId, 'trafficLight', 'current'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data()
          setData({
            status: d.status ?? 'green',
            reason: d.reason ?? null,
            updatedAt: toDate(d.updatedAt),
          })
        } else {
          setData({ status: 'green', reason: null, updatedAt: new Date() })
        }
        setLoading(false)
      }
    )

    const eventsQuery = query(
      collection(db, 'couples', coupleId, 'trafficLightEvents'),
      orderBy('createdAt', 'desc'),
      limit(10)
    )
    const unsubEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(
        snap.docs.map((d) => ({
          id: d.id,
          status: d.data().status as TrafficStatus,
          reason: d.data().reason ?? null,
          createdAt: toDate(d.data().createdAt),
        }))
      )
    })

    return () => {
      unsubData()
      unsubEvents()
    }
  }, [coupleId])

  async function setStatus(status: TrafficStatus, reason: string | null = null) {
    await setDoc(
      doc(db, 'couples', coupleId, 'trafficLight', 'current'),
      { status, reason, updatedAt: Timestamp.now() }
    )
    await addDoc(collection(db, 'couples', coupleId, 'trafficLightEvents'), {
      status,
      reason,
      createdAt: Timestamp.now(),
    })
  }

  return { data, events, loading, setStatus }
}
