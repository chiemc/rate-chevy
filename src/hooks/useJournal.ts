'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { JournalEntry } from '@/types'

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate()
  if (val instanceof Date) return val
  return new Date()
}

export function useJournal(coupleId: string) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!coupleId) return

    const q = query(
      collection(db, 'couples', coupleId, 'journalEntries'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setEntries(
        snap.docs.map((d) => ({
          id: d.id,
          authorId: d.data().authorId,
          title: d.data().title ?? null,
          body: d.data().body,
          mood: d.data().mood ?? null,
          createdAt: toDate(d.data().createdAt),
          updatedAt: toDate(d.data().updatedAt),
        }))
      )
      setLoading(false)
    })

    return () => unsub()
  }, [coupleId])

  async function addEntry(
    authorId: string,
    body: string,
    title: string | null = null,
    mood: string | null = null
  ) {
    await addDoc(collection(db, 'couples', coupleId, 'journalEntries'), {
      authorId,
      title,
      body,
      mood,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }

  async function updateEntry(
    id: string,
    body: string,
    title: string | null = null,
    mood: string | null = null
  ) {
    await updateDoc(doc(db, 'couples', coupleId, 'journalEntries', id), {
      title,
      body,
      mood,
      updatedAt: Timestamp.now(),
    })
  }

  async function deleteEntry(id: string) {
    await deleteDoc(doc(db, 'couples', coupleId, 'journalEntries', id))
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}
