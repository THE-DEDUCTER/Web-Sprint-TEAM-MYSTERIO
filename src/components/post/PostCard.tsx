'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Send } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { renderBody } from './renderBody'
import { toggleLike, addReply } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'
import type { Post, AppUser } from '@/types'

function timeAgo(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function PostCard({ post, users, onChange }: { post: Post; users: AppUser[]; onChange: (p: Post) => void }) {
  const { user: me } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [replyDraft, setReplyDraft] = useState('')
  const author = users.find((u) => u.id === post.authorId)

  async function like() {
    if (!me) return
    await toggleLike(post.id, me.id)
    onChange({ ...post, likedByMe: !post.likedByMe, likeCount: post.likeCount + (post.likedByMe ? -1 : 1) })
  }

  async function sendReply() {
    if (!me || !replyDraft.trim()) return
    const reply = await addReply(post.id, me.id, replyDraft.trim())
    onChange({ ...post, replies: [...post.replies, reply] })
    setReplyDraft('')
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar name={author?.displayName ?? '?'} url={author?.avatarUrl} size={38} />
          <div>
            <p className="text-sm">
              <Link href={`/dashboard/profile/${author?.handle}`} className="font-semibold hover:underline">
                {author?.displayName ?? 'Unknown'}
              </Link>{' '}
              <span className="text-neutral-400">@{author?.handle}</span>{' '}
              <span className="text-neutral-400">· {timeAgo(post.createdAt)}</span>
            </p>
          </div>
        </div>
        <button onClick={like} className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${post.likedByMe ? 'text-pink-600' : 'text-neutral-400 hover:text-pink-500'}`}>
          <Heart size={16} fill={post.likedByMe ? 'currentColor' : 'none'} />
          {post.likeCount}
        </button>
      </div>

      <div className="mt-2 whitespace-pre-wrap pl-[50px] text-sm leading-relaxed">{renderBody(post.body)}</div>

      <div className="mt-3 pl-[50px]">
        <button onClick={() => setExpanded((e) => !e)} className="text-xs font-medium text-neutral-400 hover:text-brand-600">
          {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 border-l-2 border-neutral-100 dark:border-neutral-800 pl-4">
            {post.replies.map((r) => {
              const ru = users.find((u) => u.id === r.authorId)
              return (
                <div key={r.id} className="flex items-start gap-2.5">
                  <Avatar name={ru?.displayName ?? '?'} url={ru?.avatarUrl} size={28} />
                  <div className="text-sm">
                    <p>
                      <Link href={`/dashboard/profile/${ru?.handle}`} className="font-semibold hover:underline">
                        {ru?.displayName}
                      </Link>{' '}
                      <span className="text-xs text-neutral-400">@{ru?.handle} · {timeAgo(r.createdAt)}</span>
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">{r.body}</p>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-2">
              <input
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                placeholder="Write a reply… Type @ to tag someone"
                className="flex-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-1.5 text-sm outline-none focus:border-brand-400"
              />
              <button onClick={sendReply} className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-40" disabled={!replyDraft.trim()}>
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
