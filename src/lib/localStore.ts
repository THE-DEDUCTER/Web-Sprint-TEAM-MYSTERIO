import type { AppUser, Post, Community, ChatMessage, Conversation, XdItem, AppNotification, ContactMessage } from '@/types'
import { seedUsers } from './seed/users'
import { seedCommunities } from './seed/communities'
import { seedPosts } from './seed/posts'
import { seedXdItems } from './seed/xdItems'
import { buildSeedNotifications } from './seed/notifications'

const PREFIX = 'cohort_clone_'

function isClient() {
  return typeof window !== 'undefined'
}

function read<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (!isClient()) return
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

let initialized = false

export function ensureSeeded() {
  if (!isClient()) return
  if (initialized) return
  initialized = true
  if (!localStorage.getItem(PREFIX + 'seeded_v2')) {
    write('users', seedUsers)
    write('communities', seedCommunities)
    write('posts', seedPosts)
    write('xd_items', seedXdItems)
    write('follows', [] as { followerId: string; followeeId: string }[])
    write('conversations', [] as Conversation[])
    write('messages', [] as ChatMessage[])
    write('notifications', {} as Record<string, AppNotification[]>)
    write('contact_messages', [] as ContactMessage[])
    write('community_subs', { 'u-veerbhadra': ['com-cohort'] } as Record<string, string[]>)
    localStorage.setItem(PREFIX + 'seeded_v2', '1')
  }
}

export const store = {
  users: {
    all: (): AppUser[] => read('users', seedUsers),
    save: (users: AppUser[]) => write('users', users),
  },
  communities: {
    all: (): Community[] => read('communities', seedCommunities),
    save: (cs: Community[]) => write('communities', cs),
  },
  posts: {
    all: (): Post[] => read('posts', seedPosts),
    save: (p: Post[]) => write('posts', p),
  },
  xdItems: {
    all: (): XdItem[] => read('xd_items', seedXdItems),
    save: (items: XdItem[]) => write('xd_items', items),
  },
  follows: {
    all: (): { followerId: string; followeeId: string }[] => read('follows', []),
    save: (f: { followerId: string; followeeId: string }[]) => write('follows', f),
  },
  conversations: {
    all: (): Conversation[] => read('conversations', []),
    save: (c: Conversation[]) => write('conversations', c),
  },
  messages: {
    all: (): ChatMessage[] => read('messages', []),
    save: (m: ChatMessage[]) => write('messages', m),
  },
  notifications: {
    forUser: (userId: string): AppNotification[] => {
      const all = read<Record<string, AppNotification[]>>('notifications', {})
      if (!all[userId]) {
        all[userId] = buildSeedNotifications(userId)
        write('notifications', all)
      }
      return all[userId]
    },
    save: (userId: string, list: AppNotification[]) => {
      const all = read<Record<string, AppNotification[]>>('notifications', {})
      all[userId] = list
      write('notifications', all)
    },
  },
  contactMessages: {
    all: (): ContactMessage[] => read('contact_messages', []),
    save: (m: ContactMessage[]) => write('contact_messages', m),
  },
  communitySubs: {
    all: (): Record<string, string[]> => read('community_subs', {}),
    save: (m: Record<string, string[]>) => write('community_subs', m),
  },
  currentUserId: {
    get: (): string | null => isClient() ? localStorage.getItem(PREFIX + 'current_user') : null,
    set: (id: string | null) => {
      if (!isClient()) return
      if (id) localStorage.setItem(PREFIX + 'current_user', id)
      else localStorage.removeItem(PREFIX + 'current_user')
    },
  },
}
