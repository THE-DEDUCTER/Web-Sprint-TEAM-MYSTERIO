export type Role = 'user' | 'admin'

export interface AppUser {
  id: string
  handle: string
  displayName: string
  avatarUrl?: string
  bannerUrl?: string
  department?: string
  role: Role
  whatsapp?: string
  linkedinUsername?: string
  email?: string
  bio?: string
  communitiesCount: number
  followersCount: number
  followingCount: number
  flexCount: number
}

export interface Post {
  id: string
  authorId: string
  body: string
  createdAt: string
  attachments: string[]
  mentions: string[]
  likeCount: number
  likedByMe: boolean
  replies: Reply[]
}

export interface Reply {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
}

export interface Community {
  id: string
  handle: string
  name: string
  description: string
  department: string
  logoUrl?: string
  bannerUrl?: string
  instagramUrl?: string
  linkedinUrl?: string
  memberCount: number
  isNew?: boolean
  subscribed?: boolean
}

export interface FollowEdge {
  followerId: string
  followeeId: string
}

export interface Conversation {
  id: string
  userA: string
  userB: string
  lastMessageAt?: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  body: string
  sentAt: string
  readAt?: string
  expiresAt?: string
}

export interface XdItem {
  id: string
  tag: string
  mediaUrl: string
  sourceUrl: string
  mediaType: 'image' | 'video'
  caption?: string
  likeCount: number
  likedByMe: boolean
}

export type PoiCategory =
  | 'academic'
  | 'food'
  | 'atm'
  | 'sports'
  | 'medical'
  | 'hostel'
  | 'bus'
  | 'other'

export interface MapPoi {
  id: string
  name: string
  category: PoiCategory
  lat: number
  lng: number
  description?: string
}

export type EventType = 'exam' | 'holiday' | 'deadline' | 'event'

export interface AcademicEvent {
  id: string
  title: string
  date: string
  type: EventType
  description?: string
}

export type NotificationType = 'people' | 'community' | 'mention' | 'like' | 'reply' | 'event'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  refId?: string
  title: string
  body: string
  createdAt: string
  readAt?: string
}

export interface ContactMessage {
  id: string
  userId?: string
  name: string
  email: string
  message: string
  createdAt: string
}
