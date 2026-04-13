'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useJournal } from '@/hooks/useJournal'
import NewEntryForm from './NewEntryForm'
import type { JournalEntry } from '@/types'

const moodMap: Record<string, { emoji: string; label: string }> = {
  grateful:   { emoji: '🥹', label: 'grateful' },
  happy:      { emoji: '😁', label: 'happy' },
  hopeful:    { emoji: '🙏', label: 'hopeful' },
  cautious:   { emoji: '😐', label: 'cautious' },
  frustrated: { emoji: '😤', label: 'frustrated' },
  hurt:       { emoji: '😢', label: 'hurt' },
  angry:      { emoji: '😡', label: 'angry' },
  done:       { emoji: '😒', label: 'over it' },
}

interface Props {
  entry: JournalEntry
  onClose: () => void
}

export default function JournalEntryDetail({ entry, onClose }: Props) {
  const { profile } = useAuth()
  const { deleteEntry } = useJournal(profile!.coupleId)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (editing) {
    return (
      <NewEntryForm
        editEntry={{ id: entry.id, title: entry.title, body: entry.body, mood: entry.mood }}
        onClose={() => {
          setEditing(false)
          onClose()
        }}
      />
    )
  }

  async function handleDelete() {
    await deleteEntry(entry.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-orange-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-orange-100 bg-white">
        <button
          onClick={onClose}
          className="text-stone-500 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-stone-100"
        >
          ← back
        </button>
        {profile?.role === 'girlfriend' && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-pink-500 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-orange-50"
            >
              edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-rose-500 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-rose-50"
            >
              delete
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Date & mood */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-stone-400 text-sm">
            {entry.createdAt.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {entry.mood && moodMap[entry.mood] && (
            <span className="flex items-center gap-1.5 text-sm text-stone-500">
              <span className="text-2xl">{moodMap[entry.mood].emoji}</span>
              <span>{moodMap[entry.mood].label}</span>
            </span>
          )}
        </div>

        {/* Title */}
        {entry.title && (
          <h1 className="text-2xl font-bold text-stone-800 mb-4">{entry.title}</h1>
        )}

        {/* Body */}
        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base">
          {entry.body}
        </p>

        {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
          <p className="text-stone-400 text-xs mt-6">
            edited{' '}
            {entry.updatedAt.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800 text-center">delete this entry?</h3>
            <p className="text-stone-500 text-sm text-center">this can&apos;t be undone.</p>
            <button
              onClick={handleDelete}
              className="w-full py-3 rounded-2xl bg-rose-500 text-white font-semibold"
            >
              delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-full py-3 rounded-2xl bg-stone-100 text-stone-700 font-semibold"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
