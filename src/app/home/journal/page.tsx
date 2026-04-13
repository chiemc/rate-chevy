'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useJournal } from '@/hooks/useJournal'
import JournalEntryCard from '@/components/journal/JournalEntryCard'
import JournalEntryDetail from '@/components/journal/JournalEntryDetail'
import NewEntryForm from '@/components/journal/NewEntryForm'
import type { JournalEntry } from '@/types'

export default function JournalPage() {
  const { profile } = useAuth()
  const { entries, loading } = useJournal(profile!.coupleId)
  const [selected, setSelected] = useState<JournalEntry | null>(null)
  const [writing, setWriting] = useState(false)

  if (loading) {
    return (
      <div className="text-center py-12 text-stone-400">Loading journal...</div>
    )
  }

  if (writing) {
    return <NewEntryForm onClose={() => setWriting(false)} />
  }

  if (selected) {
    return (
      <JournalEntryDetail
        entry={selected}
        onClose={() => setSelected(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">📓 journal</h1>
        {profile?.role === 'girlfriend' && (
          <button
            onClick={() => setWriting(true)}
            className="w-10 h-10 rounded-2xl bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white font-bold text-xl flex items-center justify-center shadow-sm transition-colors"
          >
            +
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-4">📓</div>
          {profile?.role === 'girlfriend' ? (
            <>
              <p className="font-medium text-stone-600">no entries yet</p>
              <p className="text-sm mt-1">tap + to write your first entry</p>
            </>
          ) : (
            <>
              <p className="font-medium text-stone-600">nothing here yet</p>
              <p className="text-sm mt-1">jen hasn't written anything yet</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onClick={() => setSelected(entry)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
