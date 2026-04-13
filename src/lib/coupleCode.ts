import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Role } from '@/types'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  return Array.from(
    { length: 6 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

export async function createCouple(uid: string, displayName: string): Promise<string> {
  const code = generateCode()
  const coupleRef = await addDoc(collection(db, 'couples'), {
    coupleCode: code,
    members: [uid],
    createdAt: Timestamp.now(),
  })
  await setDoc(doc(db, 'users', uid), {
    coupleId: coupleRef.id,
    role: 'girlfriend' as Role,
    displayName,
  })
  return coupleRef.id
}

export async function joinCouple(
  uid: string,
  displayName: string,
  code: string
): Promise<string> {
  const q = query(
    collection(db, 'couples'),
    where('coupleCode', '==', code.toUpperCase().trim())
  )
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('No couple found with that code. Check the code and try again.')

  const coupleDoc = snap.docs[0]
  const coupleId = coupleDoc.id

  await updateDoc(doc(db, 'couples', coupleId), {
    members: arrayUnion(uid),
  })
  await setDoc(doc(db, 'users', uid), {
    coupleId,
    role: 'boyfriend' as Role,
    displayName,
  })
  return coupleId
}
