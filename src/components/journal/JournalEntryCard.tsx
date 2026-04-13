'use client'

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
  onClick: () => void
}

export default function JournalEntryCard({ entry, onClick }: Props) {
  const preview = entry.body.slice(0, 120) + (entry.body.length > 120 ? '…' : '')

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-3xl p-5 shadow-sm border border-orange-100 hover:border-orange-200 active:bg-orange-50 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-stone-800 line-clamp-1">
          {entry.title ?? entry.createdAt.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        {entry.mood && moodMap[entry.mood] && (
          <span className="flex items-center gap-1 text-sm text-stone-500 shrink-0">
            <span className="text-xl">{moodMap[entry.mood].emoji}</span>
            <span>{moodMap[entry.mood].label}</span>
          </span>
        )}
      </div>
      <p className="text-stone-500 text-sm leading-relaxed">{preview}</p>
      <p className="text-stone-400 text-xs mt-3">
        {entry.createdAt.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </button>
  )
}
