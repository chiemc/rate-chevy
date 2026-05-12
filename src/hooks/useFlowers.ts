'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FlowersData } from '@/types'

function getWeekString(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate()
  if (val instanceof Date) return val
  return new Date()
}

export function useFlowers(coupleId: string) {
  const [data, setData] = useState<FlowersData | null>(null)
  const [loading, setLoading] = useState(true)

  const currentWeek = getWeekString(new Date())

  useEffect(() => {
    if (!coupleId) return

    const unsub = onSnapshot(
      doc(db, 'couples', coupleId, 'flowers', 'current'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data()
          setData({
            gotFlowers: d.weekOf === currentWeek ? (d.gotFlowers ?? null) : null,
            weekOf: currentWeek,
            updatedAt: toDate(d.updatedAt),
          })
        } else {
          setData({ gotFlowers: null, weekOf: currentWeek, updatedAt: new Date() })
        }
        setLoading(false)
      }
    )

    return () => unsub()
  }, [coupleId, currentWeek])

  async function setFlowers(gotFlowers: boolean) {
    await setDoc(doc(db, 'couples', coupleId, 'flowers', 'current'), {
      gotFlowers,
      weekOf: currentWeek,
      updatedAt: Timestamp.now(),
    })
  }

  return { data, loading, setFlowers }
}
