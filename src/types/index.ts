export type Role = 'girlfriend' | 'boyfriend'

export interface UserProfile {
  uid: string
  coupleId: string
  role: Role
  displayName: string
}

export interface StarData {
  rating: number // 0–5 current rating
  totalStars: number // net brownie points (awarded minus revoked)
  revokedStars: number // total brownie points revoked
  updatedAt: Date
}

export interface StarEvent {
  id: string
  delta: number
  note: string | null
  type: 'rating' | 'brownie' | 'revoke' | null
  createdAt: Date
}

export type TrafficStatus = 'red' | 'yellow' | 'green'

export interface TrafficData {
  status: TrafficStatus
  reason: string | null
  updatedAt: Date
}

export interface TrafficEvent {
  id: string
  status: TrafficStatus
  reason: string | null
  createdAt: Date
}

export interface JournalEntry {
  id: string
  authorId: string
  title: string | null
  body: string
  mood: string | null
  createdAt: Date
  updatedAt: Date
}
