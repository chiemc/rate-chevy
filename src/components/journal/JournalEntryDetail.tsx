'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useJournal } from '@/hooks/useJournal'
import { useJournalComments } from '@/hooks/useJournalComments'
import NewEntryForm from './NewEntryForm'
import type { JournalEntry, JournalComment } from '@/types'

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
  const { comments, addComment, deleteComment } = useJournalComments(profile!.coupleId, entry.id)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<JournalComment | null>(null)

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

  async function handleAddComment() {
    const trimmed = commentText.trim()
    if (!trimmed) return
    setSubmittingComment(true)
    await addComment(profile!.uid, trimmed, replyingTo?.id)
    setCommentText('')
    setReplyingTo(null)
    setSubmittingComment(false)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-orange-50 flex flex-col">
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
              className="text-stone-600 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-orange-50"
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

        {/* Comments */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">
            comments
          </h3>

          {comments.length === 0 ? (
            <p className="text-stone-400 text-sm italic">no comments yet</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.filter((c) => !c.replyToId).map((c) => {
                const isMe = c.authorId === profile?.uid
                const authorLabel = isMe
                  ? profile?.role === 'girlfriend' ? 'jen' : 'chevy'
                  : profile?.role === 'girlfriend' ? 'chevy' : 'jen'
                const isSelected = replyingTo?.id === c.id
                const canReply = profile?.role === 'girlfriend' && !isMe
                const replies = comments.filter((r) => r.replyToId === c.id)
                return (
                  <div key={c.id} className="space-y-1.5">
                    <div
                      className={`rounded-2xl px-4 py-3 border transition-colors mr-6 ${
                        isSelected
                          ? 'bg-orange-100 border-orange-300'
                          : 'bg-white border-orange-100'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 text-stone-400">{authorLabel}</p>
                      <p className="text-stone-700 text-sm leading-relaxed">{c.body}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-stone-400 text-xs">
                          {c.createdAt.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {canReply && (
                          <button
                            onClick={() => setReplyingTo(isSelected ? null : c)}
                            className={`text-xs font-medium px-2 py-0.5 rounded-lg transition-colors ${
                              isSelected
                                ? 'text-orange-500 bg-orange-200'
                                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {isSelected ? 'cancel' : 'reply'}
                          </button>
                        )}
                      </div>
                    </div>

                    {replies.map((r) => {
                      const replyIsMe = r.authorId === profile?.uid
                      const replyAuthorLabel = replyIsMe
                        ? profile?.role === 'girlfriend' ? 'jen' : 'chevy'
                        : profile?.role === 'girlfriend' ? 'chevy' : 'jen'
                      return (
                        <div
                          key={r.id}
                          className="ml-6 rounded-2xl px-4 py-3 border bg-orange-50 border-orange-200"
                        >
                          <p className="text-xs font-semibold mb-1 text-orange-400">{replyAuthorLabel}</p>
                          <p className="text-stone-700 text-sm leading-relaxed">{r.body}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-stone-400 text-xs">
                              {r.createdAt.toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {replyIsMe && profile?.role === 'girlfriend' && (
                              <button
                                onClick={() => deleteComment(r.id)}
                                className="text-xs text-rose-400 hover:text-rose-600 font-medium px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors"
                              >
                                delete
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {(profile?.role === 'boyfriend' || replyingTo) && (
            <div className="mt-4 space-y-2">
              {replyingTo && (
                <div className="flex items-start gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex-1 min-w-0 pl-2 border-l-2 border-orange-300">
                    <p className="text-xs text-stone-400 font-medium mb-0.5">replying to chevy</p>
                    <p className="text-xs text-stone-500 truncate">{replyingTo.body}</p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-stone-400 hover:text-stone-600 text-sm leading-none mt-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyingTo ? 'write your reply...' : 'leave a comment...'}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-stone-800 text-sm resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || submittingComment}
                className="w-full py-3 rounded-2xl bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white font-semibold transition-colors disabled:opacity-40"
              >
                {submittingComment ? 'posting...' : profile?.role === 'girlfriend' ? 'post reply' : 'post comment'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-[60]">
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
