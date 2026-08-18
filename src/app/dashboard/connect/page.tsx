'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ShieldCheck, Send } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { getUsers, getUserByHandle, getOrCreateConversation, getMessages, sendMessage, markMessageRead } from '@/lib/db'
import type { AppUser, ChatMessage } from '@/types'

export default function Connect() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<AppUser[]>([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<AppUser | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    getUsers().then((us) => setUsers(us.filter((u) => u.id !== user?.id)))
  }, [user])

  useEffect(() => {
    const handle = searchParams.get('user')
    if (handle && users.length) {
      getUserByHandle(handle).then((u) => u && openConversation(u))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, users])

  async function openConversation(otherUser: AppUser) {
    if (!user) return
    setActive(otherUser)
    const convo = await getOrCreateConversation(user.id, otherUser.id)
    setConversationId(convo.id)
    const msgs = await getMessages(convo.id)
    setMessages(msgs)
    msgs.forEach((m) => {
      if (m.senderId !== user.id && !m.readAt) scheduleExpiry(m.id)
    })
  }

  function scheduleExpiry(messageId: string) {
    markMessageRead(messageId)
    timers.current[messageId] = setTimeout(() => {
      setMessages((ms) => ms.filter((m) => m.id !== messageId))
    }, 30000)
  }

  async function send() {
    if (!user || !conversationId || !draft.trim()) return
    const msg = await sendMessage(conversationId, user.id, draft.trim())
    setMessages((m) => [...m, msg])
    setDraft('')
  }

  const filteredUsers = users.filter((u) => u.displayName.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <PageHeader title="connect" subtitle="Encrypted chats for cohort users." />
      <div className="flex h-[560px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-1.5 pl-8 pr-3 text-sm outline-none"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => openConversation(u)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 ${active?.id === u.id ? 'bg-neutral-100 dark:bg-neutral-800' : ''}`}
              >
                <Avatar name={u.displayName} url={u.avatarUrl} size={34} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.displayName}</p>
                  <p className="truncate text-xs text-neutral-400">@{u.handle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-neutral-50/50 dark:bg-neutral-950">
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <ShieldCheck size={40} className="text-brand-500" />
              <h3 className="text-lg font-bold">Start a secure conversation</h3>
              <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
                Pick any cohort user from the left to open an encrypted chat. Messages auto-disappear 30 seconds after read.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
                <Avatar name={active.displayName} url={active.avatarUrl} size={32} />
                <div>
                  <p className="text-sm font-semibold">{active.displayName}</p>
                  <p className="text-xs text-neutral-400">@{active.handle}</p>
                </div>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.length === 0 && <p className="text-center text-xs text-neutral-400">No messages yet — say hi!</p>}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.senderId === user?.id ? 'ml-auto bg-brand-600 text-white' : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Type a message…"
                  className="flex-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2 text-sm outline-none"
                />
                <button onClick={send} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-40" disabled={!draft.trim()}>
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
