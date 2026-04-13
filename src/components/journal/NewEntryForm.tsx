'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useJournal } from '@/hooks/useJournal'
import MoodPicker from '@/components/ui/MoodPicker'

interface Props {
  onClose: () => void
  editEntry?: {
    id: string
    title: string | null
    body: string
    mood: string | null
  }
}

export default function NewEntryForm({ onClose, editEntry }: Props) {
  const { user, profile } = useAuth()
  const { addEntry, updateEntry } = useJournal(profile!.coupleId)
  const [title, setTitle] = useState(editEntry?.title ?? '')
  const [body, setBody] = useState(editEntry?.body ?? '')
  const [mood, setMood] = useState<string | null>(editEntry?.mood ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!body.trim()) {
      setError('write something first!')
      return
    }
    setSaving(true)
    try {
      if (editEntry) {
        await updateEntry(editEntry.id, body.trim(), title.trim() || null, mood)
      } else {
        await addEntry(user!.uid, body.trim(), title.trim() || null, mood)
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-orange-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-orange-100 bg-white">
        <button
          onClick={onClose}
          className="text-stone-500 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-stone-100"
        >
          cancel
        </button>
        <h2 className="font-semibold text-stone-800">
          {editEntry ? 'edit entry' : 'new entry'}
        </h2>
        <button
          onClick={handleSave}
          disabled={saving || !body.trim()}
          className="text-stone-600 text-sm font-semibold px-3 py-1.5 rounded-xl hover:bg-orange-50 disabled:opacity-40"
        >
          {saving ? 'saving...' : 'save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title (optional)"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-stone-800 font-semibold text-lg"
        />

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="how is he doing? what is he doing right or wrong? what can he improve on? write your feedback here..."
          rows={12}
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-stone-800 resize-none text-base leading-relaxed"
        />

        {/* Mood */}
        <div>
          <p className="text-sm font-medium text-stone-600 mb-2">how are you feeling?</p>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        {error && (
          <p className="text-rose-500 text-sm bg-rose-50 rounded-xl px-4 py-3">{error}</p>
        )}
      </div>
    </div>
  )
}
