import { supabase, isSupabaseConfigured } from './supabaseClient'
import { store, ensureSeeded } from './localStore'
import type {
  AppUser, Post, Reply, Community, Conversation, ChatMessage, XdItem, AppNotification, ContactMessage,
} from '@/types'

ensureSeeded()

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

// ---------- Users ----------
export async function getUsers(): Promise<AppUser[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('users').select('*')
    return (data as AppUser[]) ?? []
  }
  return store.users.all()
}

export async function getUserById(id: string): Promise<AppUser | undefined> {
  const users = await getUsers()
  return users.find((u) => u.id === id)
}

export async function getUserByHandle(handle: string): Promise<AppUser | undefined> {
  const users = await getUsers()
  return users.find((u) => u.handle === handle)
}

export async function updateUser(id: string, patch: Partial<AppUser>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('users').update(patch).eq('id', id)
    return
  }
  const users = store.users.all()
  const idx = users.findIndex((u) => u.id === id)
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...patch }
    store.users.save(users)
  }
}

// ---------- Follows ----------
export async function getFollowing(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('follows').select('followee_id').eq('follower_id', userId)
    return (data ?? []).map((r: any) => r.followee_id)
  }
  return store.follows.all().filter((f) => f.followerId === userId).map((f) => f.followeeId)
}

export async function toggleFollow(followerId: string, followeeId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('follows').select('*').eq('follower_id', followerId).eq('followee_id', followeeId).maybeSingle()
    if (data) {
      await supabase.from('follows').delete().eq('follower_id', followerId).eq('followee_id', followeeId)
      return false
    }
    await supabase.from('follows').insert({ follower_id: followerId, followee_id: followeeId })
    return true
  }
  const all = store.follows.all()
  const idx = all.findIndex((f) => f.followerId === followerId && f.followeeId === followeeId)
  if (idx >= 0) {
    all.splice(idx, 1)
    store.follows.save(all)
    return false
  }
  all.push({ followerId, followeeId })
  store.follows.save(all)
  return true
}

// ---------- Posts ----------
export async function getPosts(authorId?: string): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('posts').select('*, replies(*)').order('created_at', { ascending: false })
    let posts = (data as Post[]) ?? []
    if (authorId) posts = posts.filter((p) => p.authorId === authorId)
    return posts
  }
  let posts = [...store.posts.all()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  if (authorId) posts = posts.filter((p) => p.authorId === authorId)
  return posts
}

export async function createPost(authorId: string, body: string): Promise<Post> {
  const mentions = Array.from(body.matchAll(/@(\w+)/g)).map((m) => m[1])
  const newPost: Post = {
    id: uid('p'),
    authorId,
    body,
    createdAt: new Date().toISOString(),
    attachments: [],
    mentions,
    likeCount: 0,
    likedByMe: false,
    replies: [],
  }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('posts').insert({ id: newPost.id, author_id: authorId, body, mentions })
    return newPost
  }
  const posts = store.posts.all()
  posts.unshift(newPost)
  store.posts.save(posts)
  return newPost
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('post_likes').select('*').eq('post_id', postId).eq('user_id', userId).maybeSingle()
    if (data) await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    else await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    return
  }
  const posts = store.posts.all()
  const post = posts.find((p) => p.id === postId)
  if (!post) return
  post.likedByMe = !post.likedByMe
  post.likeCount += post.likedByMe ? 1 : -1
  store.posts.save(posts)
}

export async function addReply(postId: string, authorId: string, body: string): Promise<Reply> {
  const reply: Reply = { id: uid('r'), postId, authorId, body, createdAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('replies').insert({ id: reply.id, post_id: postId, author_id: authorId, body })
    return reply
  }
  const posts = store.posts.all()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    post.replies.push(reply)
    store.posts.save(posts)
  }
  return reply
}

// ---------- Communities ----------
export async function getCommunities(): Promise<Community[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('communities').select('*')
    return (data as Community[]) ?? []
  }
  return store.communities.all()
}

export async function getCommunityByHandle(handle: string): Promise<Community | undefined> {
  const cs = await getCommunities()
  return cs.find((c) => c.handle === handle)
}

export async function getSubscriptions(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('community_subscriptions').select('community_id').eq('user_id', userId)
    return (data ?? []).map((r: any) => r.community_id)
  }
  return store.communitySubs.all()[userId] ?? []
}

export async function toggleSubscription(userId: string, communityId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('community_subscriptions').select('*').eq('user_id', userId).eq('community_id', communityId).maybeSingle()
    if (data) {
      await supabase.from('community_subscriptions').delete().eq('user_id', userId).eq('community_id', communityId)
      return false
    }
    await supabase.from('community_subscriptions').insert({ user_id: userId, community_id: communityId })
    return true
  }
  const subs = store.communitySubs.all()
  const list = new Set(subs[userId] ?? [])
  let joined: boolean
  if (list.has(communityId)) {
    list.delete(communityId)
    joined = false
  } else {
    list.add(communityId)
    joined = true
  }
  subs[userId] = Array.from(list)
  store.communitySubs.save(subs)
  return joined
}

export async function subscribeAll(userId: string, communityIds: string[]): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('community_subscriptions').upsert(communityIds.map((id) => ({ user_id: userId, community_id: id })))
    return
  }
  const subs = store.communitySubs.all()
  const list = new Set(subs[userId] ?? [])
  communityIds.forEach((id) => list.add(id))
  subs[userId] = Array.from(list)
  store.communitySubs.save(subs)
}

// ---------- Connect (DMs) ----------
export async function getOrCreateConversation(userA: string, userB: string): Promise<Conversation> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('conversations').select('*').or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`).maybeSingle()
    if (data) return data as Conversation
    const { data: created } = await supabase.from('conversations').insert({ user_a: userA, user_b: userB }).select().single()
    return created as Conversation
  }
  const convos = store.conversations.all()
  let convo = convos.find((c) => (c.userA === userA && c.userB === userB) || (c.userA === userB && c.userB === userA))
  if (!convo) {
    convo = { id: uid('conv'), userA, userB }
    convos.push(convo)
    store.conversations.save(convos)
  }
  return convo
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('conversations').select('*').or(`user_a.eq.${userId},user_b.eq.${userId}`)
    return (data as Conversation[]) ?? []
  }
  return store.conversations.all().filter((c) => c.userA === userId || c.userB === userId)
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('sent_at', { ascending: true })
    return (data as ChatMessage[]) ?? []
  }
  return store.messages.all().filter((m) => m.conversationId === conversationId)
}

export async function sendMessage(conversationId: string, senderId: string, body: string): Promise<ChatMessage> {
  const msg: ChatMessage = { id: uid('msg'), conversationId, senderId, body, sentAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').insert({ id: msg.id, conversation_id: conversationId, sender_id: senderId, body_ciphertext: body, sent_at: msg.sentAt })
    return msg
  }
  const msgs = store.messages.all()
  msgs.push(msg)
  store.messages.save(msgs)
  return msg
}

export async function markMessageRead(messageId: string): Promise<void> {
  const readAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 30000).toISOString()
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').update({ read_at: readAt, expires_at: expiresAt }).eq('id', messageId)
    return
  }
  const msgs = store.messages.all()
  const m = msgs.find((x) => x.id === messageId)
  if (m) {
    m.readAt = readAt
    m.expiresAt = expiresAt
    store.messages.save(msgs)
  }
}

// ---------- XD ----------
export async function getXdItems(tag?: string): Promise<XdItem[]> {
  const items = isSupabaseConfigured && supabase
    ? ((await supabase.from('xd_items').select('*')).data as XdItem[]) ?? []
    : store.xdItems.all()
  return tag ? items.filter((i) => i.tag === tag) : items
}

export async function toggleXdLike(itemId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) return
  const items = store.xdItems.all()
  const item = items.find((i) => i.id === itemId)
  if (!item) return
  item.likedByMe = !item.likedByMe
  item.likeCount += item.likedByMe ? 1 : -1
  store.xdItems.save(items)
}

// ---------- Notifications ----------
export async function getNotifications(userId: string): Promise<AppNotification[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    return (data as AppNotification[]) ?? []
  }
  return [...store.notifications.forUser(userId)].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function markNotificationRead(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
    return
  }
  const list = store.notifications.forUser(userId)
  const n = list.find((x) => x.id === id)
  if (n) n.readAt = new Date().toISOString()
  store.notifications.save(userId, list)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null)
    return
  }
  const list = store.notifications.forUser(userId)
  const now = new Date().toISOString()
  list.forEach((n) => { if (!n.readAt) n.readAt = now })
  store.notifications.save(userId, list)
}

// ---------- Contact ----------
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> {
  const full: ContactMessage = { ...msg, id: uid('cm'), createdAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('contact_messages').insert({ user_id: msg.userId, name: msg.name, email: msg.email, message: msg.message })
    return
  }
  const all = store.contactMessages.all()
  all.push(full)
  store.contactMessages.save(all)
}
