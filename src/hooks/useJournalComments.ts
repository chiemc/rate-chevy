'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { JournalComment } from '@/types'

function toDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate()
  if (val instanceof Date) return val
  return new Date()
}

export function useJournalComments(coupleId: string, entryId: string) {
  const [comments, setComments] = useState<JournalComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!coupleId || !entryId) return

    const q = query(
      collection(db, 'couples', coupleId, 'journalEntries', entryId, 'comments'),
      orderBy('createdAt', 'asc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          authorId: d.data().authorId,
          body: d.data().body,
          replyToId: d.data().replyToId ?? undefined,
          createdAt: toDate(d.data().createdAt),
        }))
      )
      setLoading(false)
    })

    return () => unsub()
  }, [coupleId, entryId])

  async function addComment(authorId: string, body: string, replyToId?: string) {
    await addDoc(
      collection(db, 'couples', coupleId, 'journalEntries', entryId, 'comments'),
      {
        authorId,
        body,
        ...(replyToId ? { replyToId } : {}),
        createdAt: Timestamp.now(),
      }
    )
  }

  async function deleteComment(commentId: string) {
    await deleteDoc(
      doc(db, 'couples', coupleId, 'journalEntries', entryId, 'comments', commentId)
    )
  }

  return { comments, loading, addComment, deleteComment }
}
